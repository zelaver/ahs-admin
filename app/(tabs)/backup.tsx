import { View, Text, SafeAreaView, TouchableOpacity, ToastAndroid } from "react-native";
import React from "react";
import { getQuery,  } from "@/database/db";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as SQLite from "expo-sqlite";
import JSZip from "jszip";
import { useGlobalContext } from "@/context/GlobalProvider";

const backup = () => {
  const { fetchHistory, fetchCustomers, fetchTransactions, fetchProducts } = useGlobalContext();
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
      // Pilih file ZIP dari perangkat
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
      });

      if (!result.canceled) {
        const asset = result.assets[0]; // Mengambil file pertama dari array assets
        const zipFileUri = asset.uri; // URI file ZIP

        // Baca file ZIP sebagai binary
        const zipBlob = await FileSystem.readAsStringAsync(zipFileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Muat ZIP dari base64
        const zip = await JSZip.loadAsync(zipBlob, { base64: true });

        // Tentukan direktori untuk menyimpan file yang diekstrak
        const extractDir = FileSystem.documentDirectory + "SQLite/";

        // Pastikan direktori ada
        await FileSystem.makeDirectoryAsync(extractDir, { intermediates: true });

        // Ekstrak semua file
        for (const [filename, file] of Object.entries(zip.files)) {
          if (!file.dir) {
            // Pastikan itu adalah file dan bukan direktori
            const fileData = await file.async("base64");
            await FileSystem.writeAsStringAsync(extractDir + filename, fileData, {
              encoding: FileSystem.EncodingType.Base64,
            });
          }
        }

        console.log("Files extracted successfully!");
        ToastAndroid.show("Backup berhasil di pulihkan!", ToastAndroid.SHORT);
        // Buka database setelah ekstraksi
        // const db = SQLite.openDatabaseAsync("ahs-admin.db", { useNewConnection: true });
        // console.log("Database opened successfully!");
        fetchHistory();
        fetchCustomers();
        fetchTransactions();
        fetchProducts()
      } else {
        console.log("No file selected.");
        ToastAndroid.show("file tidak terpilih!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error importing or extracting ZIP file:", error);
    }
  };

  const debug = async () => {
    const data = await getQuery()
    // console.log(data)
  }

  return (
    <SafeAreaView>
      <View className="main py-8">
        <View className="section-1 px-5 py-2">
          <Text className="text-2xl font-semibold">Backup</Text>
        </View>
        <View className="section-2 px-5 py-2 h-full  justify-center items-center">
          <TouchableOpacity
            className="bg-blue-800 px-4 py-2 mb-4  rounded-md"
            activeOpacity={0.9}
            onPress={() => exportDatabase()}
          >
            <Text className="text-xl text-blue-50 font-semibold">Export</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border px-4 py-2 border-blue-800 rounded-md border-dashed"
            activeOpacity={0.9}
            onPress={() => importAndExtractZip()}
          >
            <Text className="text-xl text-blue-800 font-semibold">Import</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border px-4 py-2 border-blue-800 rounded-md border-dashed"
            activeOpacity={0.9}
            onPress={() => debug()}
          >
            <Text className="text-xl text-blue-800 font-semibold">Debug</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default backup;
