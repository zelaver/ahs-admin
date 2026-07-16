import { useGlobalContext } from "@/context/GlobalProvider";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import React, { useState } from "react";
import images from "@/constants/images";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-remix-icon";

const Backup = () => {
  const { history, fetchHistory, fetchCustomers, fetchTransactions, fetchProducts } = useGlobalContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const isLoading = isExporting || isImporting;

  const exportDatabase = async () => {
    try {
      const dir = FileSystem.documentDirectory + "SQLite/";
      const files = ["ahs-admin.db", "ahs-admin.db-wal", "ahs-admin.db-shm"];

      const zip = new JSZip();

      for (const file of files) {
        const filePath = dir + file;
        const fileData = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
        zip.file(file, fileData, { base64: true });
      }

      const zipBase64 = await zip.generateAsync({ type: "base64" });
      const zipFilePath = FileSystem.documentDirectory + "SQLite/backup.zip";
      await FileSystem.writeAsStringAsync(zipFilePath, zipBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(zipFilePath, {
        dialogTitle: "Share or copy your ZIP file via",
      });

      console.log("ZIP file exported successfully!");
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

      if (!asset.name?.toLowerCase().endsWith(".zip")) {
        throw new Error("File yang dipilih bukan file .zip");
      }

      const zipBlob = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const zip = await JSZip.loadAsync(zipBlob, { base64: true });

      const requiredFile = "ahs-admin.db";
      if (!zip.files[requiredFile] || zip.files[requiredFile].dir) {
        throw new Error(`File ZIP tidak valid: tidak ditemukan "${requiredFile}" di dalamnya`);
      }

      const extractDir = FileSystem.documentDirectory + "SQLite/";
      await FileSystem.makeDirectoryAsync(extractDir, { intermediates: true });

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header lama, tetap keep */}
      <View className="main bg-blue-100 py-8">
        <View className="section-1 flex-row items-center px-5 py-2">
          <Icon name="upload-fill" color="#172554" size={26} />
          <Text className="ml-2 text-2xl font-semibold text-blue-950">Backup</Text>
        </View>
      </View>

      {/* Konten baru mulai dari "Data Anda Aman" */}
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Info: Data Anda Aman */}
        {/* <View className="mx-5 mt-4 flex-row items-start rounded-2xl bg-blue-50 p-4">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-blue-100">
            <Icon name="shield-check-fill" color="#1e3a8a" size={22} />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-base font-bold text-blue-950">Data Anda Aman</Text>
            <Text className="text-sm leading-5 text-gray-600">
              Backup membantu melindungi data penting Anda dari kehilangan atau kerusakan perangkat.
            </Text>
          </View>
        </View> */}

        {/* Hero placeholder — ganti source di bawah dengan png lu */}
        <View className="items-center px-5 py-8">
          <Image
            source={images.backupHero}
            style={{ width: 220, height: 220 }}
            resizeMode="contain"
          />
          <Text className="mt-6 text-center text-xl font-bold text-blue-950">Backup data sekarang</Text>
          <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
            Simpan data penting Anda secara aman ke perangkat{"\n"}atau cloud untuk berjaga-jaga.
          </Text>
        </View>

        {/* Export */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isLoading}
          onPress={async () => {
            setIsExporting(true);
            await exportDatabase();
            setIsExporting(false);
          }}
          className="mx-5 mb-4 flex-row items-center justify-between rounded-2xl bg-blue-800 p-4">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              {isExporting ? (
                <ActivityIndicator size="small" color="#1e3a8a" />
              ) : (
                <Icon name="upload-2-line" color="#1e3a8a" size={22} />
              )}
            </View>
            <View>
              <Text className="text-lg font-bold text-blue-50">Export</Text>
              <Text className="text-sm text-blue-100">Simpan data ke perangkat Anda{"\n"}(file backup)</Text>
            </View>
          </View>
          <Icon name="arrow-right-s-line" color="#eff6ff" size={22} />
        </TouchableOpacity>

        {/* Import */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isLoading}
          onPress={async () => {
            setIsImporting(true);
            await importAndExtractZip();
            setIsImporting(false);
          }}
          className="mx-5 mb-4 flex-row items-center justify-between rounded-2xl border border-blue-100 bg-white p-4"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}>
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              {isImporting ? (
                <ActivityIndicator size="small" color="#1e3a8a" />
              ) : (
                <Icon name="download-2-line" color="#1e3a8a" size={22} />
              )}
            </View>
            <View>
              <Text className="text-lg font-bold text-blue-800">Import</Text>
              <Text className="text-sm text-gray-500">Pulihkan data dari file backup{"\n"}yang sudah ada</Text>
            </View>
          </View>
          <Icon name="arrow-right-s-line" color="#1e3a8a" size={22} />
        </TouchableOpacity>

        {/* Catatan */}
        {/* <View className="mx-5 flex-row items-start rounded-2xl bg-blue-50 p-4">
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-800">
            <Icon name="information-fill" color="#eff6ff" size={18} />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-base font-bold text-blue-950">Catatan</Text>
            <Text className="text-sm leading-5 text-gray-600">
              Pastikan file backup berasal dari aplikasi ini untuk menghindari kesalahan saat import.
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Backup;