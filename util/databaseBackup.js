import { Platform, Alert } from "react-native";

import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

import * as SQLite from "expo-sqlite";

import i18n from "i18n-js";

const LOCATION_NOT_WRITABLE = "locationNotWritableAlertText";
const DB_EXPORT_SUCCESSFUL = "dbExportSuccessfullyAlertText";
const EXPORT_DB_TITLE = "exportDBAlertTitle";
const IMPORT_DB_TITLE = "importDBAlertTitle";
const DB_NAME = "fuel_consumption.db";

export async function exportDB() {
  if (Platform.OS === "android") {
    try {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + `SQLite/${DB_NAME}`,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        const uri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          DB_NAME,
          "application/octet-stream"
        );

        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert(i18n.t(EXPORT_DB_TITLE), i18n.t(DB_EXPORT_SUCCESSFUL));
      } else {
        Alert.alert(
          i18n.t(EXPORT_DB_TITLE),
          i18n.t("exportDBTerminatedAlertTitle")
        );
      }
    } catch (err) {
      Alert.alert(i18n.t(EXPORT_DB_TITLE), i18n.t(LOCATION_NOT_WRITABLE));
    }
  } else {
    try {
      await Sharing.shareAsync(
        FileSystem.documentDirectory + `SQLite/${DB_NAME}`
      );

      Alert.alert(i18n.t(EXPORT_DB_TITLE), i18n.t(DB_EXPORT_SUCCESSFUL));
    } catch (err) {
      Alert.alert(i18n.t(EXPORT_DB_TITLE), LOCATION_NOT_WRITABLE);
    }
  }
}

export async function importDB() {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.type === "success") {
      if (
        !(
          await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")
        ).exists
      ) {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "SQLite"
        );
      }

      const base64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + `SQLite/${DB_NAME}`,
        base64,
        { encoding: FileSystem.EncodingType.Base64 }
      );

      SQLite.openDatabase(DB_NAME);

      Alert.alert(
        i18n.t(IMPORT_DB_TITLE),
        i18n.t("dbImportedSuccessfullyAlertText")
      );
    } else {
      Alert.alert(
        i18n.t(IMPORT_DB_TITLE),
        i18n.t("importDBTerminatedAlertTitle")
      );
    }
  } catch (err) {
    Alert.alert(i18n.t(IMPORT_DB_TITLE), i18n.t("somethingWentWrongAlertText"));
  }
}
