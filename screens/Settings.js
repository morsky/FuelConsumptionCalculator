import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
} from "react-native";

import { useState, useLayoutEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import DropDownPicker from "react-native-dropdown-picker";

import { Colors } from "../constants/colors";

import Button from "../components/UI/Button";

import { getVehicleNames } from "../util/database";

import { useDispatch, useSelector } from "react-redux";
import { getAllVehicles } from "../store/vehicleOperations";
import { setLangulage } from "../store/langulage";

import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as SQLite from "expo-sqlite";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

const LOCATION_NOT_WRITABLE = i18n.t("locationNotWritableAlertText");
const DB_EXPORT_SUCCESSFUL = i18n.t("locationNotWritableAlertText");
const DB_NAME = "fuel_consumption.db";

function Settings({ navigation, route }) {
  const [inputs, setInputs] = useState({
    itemsPerPage: { value: route.params.pages, isValid: true },
  });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "English", value: "en-US" },
    { label: "Български", value: "bg-BG" },
  ]);
  const dispatch = useDispatch();
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("settingsScreen") });
  }, [langulage]);

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

          Alert.alert(i18n.t("exportDBAlertTitle"), DB_EXPORT_SUCCESSFUL);
        } else {
          Alert.alert(
            i18n.t("exportDBAlertTitle"),
            i18n.t("exportDBTerminatedAlertTitle")
          );
        }
      } catch (err) {
        Alert.alert(i18n.t("exportDBAlertTitle"), LOCATION_NOT_WRITABLE);
      }
    } else {
      try {
        await Sharing.shareAsync(
          FileSystem.documentDirectory + `SQLite/${DB_NAME}`
        );

        Alert.alert(i18n.t("exportDBAlertTitle"), DB_EXPORT_SUCCESSFUL);
      } catch (err) {
        Alert.alert(i18n.t("exportDBAlertTitle"), LOCATION_NOT_WRITABLE);
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

        Alert.alert(
          i18n.t("importDBAlertTitle"),
          i18n.t("dbImportedSuccessfullyAlertText")
        );
      }
    } catch (err) {
      Alert.alert(
        i18n.t("importDBAlertTitle"),
        i18n.t("somethingWentWrongAlertText")
      );
    }
  }

  function selectedItemHandler(langulage) {
    const lang = langulage.value;

    i18n.locale = lang;
    storeData("langulage", lang);
    dispatch(setLangulage(lang));
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

    storeData("itemsPerPage", itemsPerPage.toString());
  }

  async function storeData(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>{i18n.t("setItemsPerPage")}</Text>

          <TextInput
            style={[styles.input, !inputs.itemsPerPage.isValid && styles.error]}
            defaultValue={inputs.itemsPerPage.value.toString()}
            keyboardType="numeric"
            onChangeText={inputChangedHandler.bind(this, "itemsPerPage")}
            onSubmitEditing={checkIUserInput}
            maxLength={3}
          />
        </View>

        <Text style={styles.text}>{i18n.t("setItemsPerPageText")}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.inputText}>{i18n.t("exportData")}</Text>

        <Button onPress={exportDB}>Export</Button>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.inputText}>{i18n.t("importData")}</Text>

        <Button onPress={importDB}>Import</Button>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.inputText}>{i18n.t("changeLangulage")}</Text>

        <View style={styles.dropdown}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            textStyle={{
              fontSize: 20,
            }}
            labelStyle={{
              fontWeight: "bold",
            }}
            placeholder="Select langulage"
            onSelectItem={(item) => {
              selectedItemHandler(item);
            }}
          />
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
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: Colors.gray600,
    borderBottomWidth: 1,
    backgroundColor: Colors.orange300,
    padding: 5,
  },
  inputContainer: {
    alignItems: "center",
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
  error: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
  },
  dropdown: {
    marginVertical: 10,
    width: "60%",
  },
});
