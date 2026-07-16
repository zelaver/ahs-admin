import { useGlobalContext } from "@/context/GlobalProvider";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import React, { useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";

const Backup = () => {
  const { history, fetchHistory, fetchCustomers, fetchTransactions, fetchProducts } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const exportDatabase = async () => {
    try {
      const dir = FileSystem.documentDirectory + "SQLite/";
      const files = ["ahs-admin.db", "ahs-admin.db-wal", "ahs-admin.db-shm"];

      const zip = new JSZip();

      // Tambahkan semua file ke zip
      for (const file of files) {
        const filePath = dir + file;
        const fileData = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
        zip.file(file, fileData, { base64: true });
      }

      // Simpan dan ekspor zip
      const zipBase64 = await zip.generateAsync({ type: "base64" });
      const zipFilePath = FileSystem.documentDirectory + "SQLite/backup.zip";
      await FileSystem.writeAsStringAsync(zipFilePath, zipBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(zipFilePath, {
        dialogTitle: "Share or copy your ZIP file via",
      });

      console.log("ZIP file exported successfully!");
      // ToastAndroid.show("Berashil membuat backup!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error creating or exporting ZIP file:", error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
    }
  };

  const importAndExtractZip = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
      });

      if (result.canceled) {
        ToastAndroid.show("File tidak terpilih!", ToastAndroid.SHORT);
        return;
      }

      const asset = result.assets[0];

      // 1. Validasi ekstensi, karena filter type gak reliable
      if (!asset.name?.toLowerCase().endsWith(".zip")) {
        throw new Error("File yang dipilih bukan file .zip");
      }

      const zipBlob = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const zip = await JSZip.loadAsync(zipBlob, { base64: true });

      // 2. Validasi isi zip harus mengandung file db utama
      const requiredFile = "ahs-admin.db";
      if (!zip.files[requiredFile] || zip.files[requiredFile].dir) {
        throw new Error(`File ZIP tidak valid: tidak ditemukan "${requiredFile}" di dalamnya`);
      }

      const extractDir = FileSystem.documentDirectory + "SQLite/";
      await FileSystem.makeDirectoryAsync(extractDir, { intermediates: true });

      // 3. (opsional tapi disarankan) tulis ke file sementara dulu,
      // baru rename setelah semua sukses, biar db lama gak "setengah tertimpa"
      // kalau di tengah proses ada error.
      for (const [filename, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const fileData = await file.async("base64");
          await FileSystem.writeAsStringAsync(extractDir + filename, fileData, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }
      }

      console.log("Files extracted successfully!");
      ToastAndroid.show("Backup berhasil di pulihkan!", ToastAndroid.SHORT);

      fetchHistory();
      fetchCustomers();
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      console.error("Error importing or extracting ZIP file:", error);
      ToastAndroid.show(`Import gagal: ${error}`, ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView>
      <View className="main bg-blue-100 py-8">
        <View className="section-1 flex-row items-center px-5 py-2">
          <Icon name="upload-fill" color="#172554" size={26} />
          <Text className="ml-2 text-2xl font-semibold text-blue-950">Backup</Text>
        </View>
        <View className="section-2 h-full items-center justify-center px-5 py-2">
          <TouchableOpacity
            className={`${
              isLoading ? "bg-blue-900" : "bg-blue-800"
            } mb-4 min-h-[50px] min-w-[100px] items-center justify-center rounded-md border border-blue-800 px-4 py-2`}
            activeOpacity={0.9}
            disabled={isLoading}
            onPress={async () => {
              setIsLoading(true);
              await exportDatabase();
              setIsLoading(false);
            }}>
            <ActivityIndicator size={"small"} color={"white"} className={`${!isLoading && "hidden"}`} />
            <Text className={`text-xl font-semibold text-blue-50 ${isLoading && "hidden"}`}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={
              "min-h-[50px] min-w-[100px] items-center justify-center rounded-md border border-dashed border-blue-800 bg-blue-50 px-4 py-2"
            }
            activeOpacity={0.9}
            disabled={isLoading}
            onPress={() => {
              setIsLoading(true);
              importAndExtractZip();
              setIsLoading(false);
            }}>
            <Text className="text-xl font-semibold text-blue-800">Import</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Backup;
