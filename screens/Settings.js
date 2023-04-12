import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
} from "react-native";

import { useState } from "react";

import { useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as SQLite from "expo-sqlite";

import { Colors } from "../constants/colors";

import { getVehicleNames } from "../util/database";

import { getAllVehicles } from "../store/vehicleOperations";

import Button from "../components/UI/Button";

const LOCATION_NOT_WRITABLE =
  "Location not writable! Please try another location!";
const DB_EXPORT_SUCCESSFUL = "Exported DB successfully!";
const DB_NAME = "fuel_consumption.db";

function Settings({ route }) {
  const [inputs, setInputs] = useState({
    itemsPerPage: { value: route.params.pages, isValid: true },
  });

  const dispatch = useDispatch();

  async function exportDB() {
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

          Alert.alert("Export DB", DB_EXPORT_SUCCESSFUL);
        } else {
          Alert.alert("Export DB", "Exporting DB terinated!");
        }
      } catch (err) {
        Alert.alert("Export DB", LOCATION_NOT_WRITABLE);
      }
    } else {
      try {
        await Sharing.shareAsync(
          FileSystem.documentDirectory + `SQLite/${DB_NAME}`
        );

        Alert.alert("Export DB", DB_EXPORT_SUCCESSFUL);
      } catch (err) {
        Alert.alert("Export DB", LOCATION_NOT_WRITABLE);
      }
    }
  }

  async function importDB() {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        if (
          !(
            await FileSystem.getInfoAsync(
              FileSystem.documentDirectory + "SQLite"
            )
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

        const vehicles = await getVehicleNames();

        dispatch(getAllVehicles(vehicles));

        Alert.alert("Import DB", "DB imported successfully!");
      }
    } catch (err) {
      Alert.alert("Import DB", "Something went wrong! Please, try again!");
    }
  }

  function inputChangedHandler(enteredText) {
    setText(enteredText);
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function checkIUserInput() {
    const itemsPerPage = +inputs.itemsPerPage.value;

    const itemsPerPageisValid =
      Number.isInteger(itemsPerPage) && itemsPerPage >= 0;

    if (!itemsPerPageisValid) {
      inputs.itemsPerPage.isValid = itemsPerPageisValid;
      setInputs((curInputs) => {
        return {
          itemsPerPage: {
            value: curInputs.itemsPerPage.value,
            isValid: itemsPerPageisValid,
          },
        };
      });
    }

    storeData(itemsPerPage.toString());
  }

  async function storeData(value) {
    try {
      await AsyncStorage.setItem("itemsPerPage", value);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Set Items Per Page</Text>

          <TextInput
            style={[styles.input, !inputs.itemsPerPage.isValid && styles.error]}
            defaultValue={inputs.itemsPerPage.value.toString()}
            keyboardType="numeric"
            onChangeText={inputChangedHandler.bind(this, "itemsPerPage")}
            onSubmitEditing={checkIUserInput}
            maxLength={3}
          />
        </View>

        <Text style={styles.text}>To view all data set Items Per Page = 0</Text>
      </View>

      <View style={styles.itemContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Export Data</Text>
          <Button onPress={exportDB}>Export</Button>
        </View>
      </View>

      <View style={styles.itemContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Import Data</Text>
          <Button onPress={importDB}>Import</Button>
        </View>
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.gray100,
    backgroundColor: Colors.yellow50,
    color: Colors.gray700,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 60,
  },
  inputText: {
    fontSize: 18,
  },
  text: {
    color: Colors.gray700,
    textAlign: "center",
    marginTop: 5,
    marginHorizontal: 10,
  },
  itemContainer: {
    borderBottomColor: Colors.gray600,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: Colors.orange300,
    padding: 5,
  },
  error: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
  },
});
