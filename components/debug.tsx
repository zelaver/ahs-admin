import { View, Text, TouchableOpacity, TextInput, Alert, ToastAndroid } from "react-native";
import React from "react";
import { initDB, execQuery, getAllTables, getQuery } from "@/database/db";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as SQLite from "expo-sqlite";
import JSZip from "jszip";

const showAlert = () => {
  Alert.alert(
    "Yakin ingin menghapus?",
    "gak di balikin loh",
    [
      {
        text: "batal",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "hapus", onPress: () => console.log("OK Pressed") },
    ],
    {
      cancelable: true,
    }
  );
};

const debug = () => {
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
      ToastAndroid.show("Berashil membuat backup!", ToastAndroid.SHORT);

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
      } else {
        console.log("No file selected.");
        ToastAndroid.show("file tidak terpilih!", ToastAndroid.SHORT);

      }
    } catch (error) {
      console.error("Error importing or extracting ZIP file:", error);
    }
  };

  const debugFilePath = async () => {
    try {
      // Mendapatkan direktori di mana file SQLite disimpan
      const sqliteDir = FileSystem.documentDirectory + "SQLite/";

      // Membaca isi direktori
      const files = await FileSystem.readDirectoryAsync(sqliteDir);

      // Menampilkan daftar file
      console.log("Files in SQLite directory:", files);
    } catch (error) {
      console.error("Error reading SQLite directory:", error);
    }
  };

  const modeWal = async () => {
    const db = SQLite.openDatabaseSync("ahs-admin.db", { useNewConnection: true });
    await db.closeAsync();
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
  };

  const modeDelete = async () => {
    const db = SQLite.openDatabaseSync("ahs-admin.db", { useNewConnection: true });
    // await db.closeAsync()
    await db.execAsync(`PRAGMA journal_mode = OFF;`);
  };

  return (
    <View className="py-12 flex-1 items-center justify-center gap-y-3">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => initDB()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          init DB
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => getAllTables()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          get ALL Tables
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => getQuery()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          get query
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => execQuery()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          exec query
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={showAlert}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          show alert
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => exportDatabase()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          export database
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => importAndExtractZip()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          import database
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={modeWal}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          Mode WAL
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={modeDelete}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          Mode Delete
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => debugFilePath()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          debug db
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default debug;
