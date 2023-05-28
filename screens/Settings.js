import { View, Text, StyleSheet } from "react-native";

import { useState, useLayoutEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import DropDownPicker from "react-native-dropdown-picker";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Constants from "expo-constants";

import { Colors } from "../constants/colors";

import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

import { useDispatch, useSelector } from "react-redux";

import { setLangulage } from "../store/langulage";
import { getAllVehicles } from "../store/vehicleOperations";

import { exportDB, importDB } from "../util/databaseBackup";
import { getVehicleNames } from "../util/database";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

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

  async function importDatabase() {
    await importDB();

    const vehicles = await getVehicleNames();

    dispatch(getAllVehicles(vehicles));
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Input
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
          inputStyle={styles.inputElement}
          label={i18n.t("setItemsPerPage")}
          invalid={!inputs.itemsPerPage.isValid}
          textInputConfig={{
            defaultValue: inputs.itemsPerPage.value.toString(),
            onChangeText: inputChangedHandler.bind(this, "itemsPerPage"),
            onSubmitEditing: checkIUserInput,
            placeholder: "0",
            keyboardType: "numeric",
            maxLength: 3,
          }}
        />

        <Text style={styles.text}>{i18n.t("setItemsPerPageText")}</Text>
      </View>

      <View style={styles.itemContainer}>
        <View style={styles.dbContainer}>
          <View style={styles.dbText}>
            <Text style={styles.itemText}>{i18n.t("exportData")}</Text>
          </View>

          <View style={styles.dbButton}>
            <Button onPress={exportDB}>
              <MaterialCommunityIcons
                name="database-export"
                size={24}
                color="white"
              />
            </Button>
          </View>
        </View>
      </View>

      <View style={styles.itemContainer}>
        <View style={styles.dbContainer}>
          <View style={styles.dbText}>
            <Text style={styles.itemText}>{i18n.t("importData")}</Text>
          </View>

          <View style={styles.dbButton}>
            <Button onPress={importDatabase}>
              <MaterialCommunityIcons
                name="database-import"
                size={24}
                color="white"
              />
            </Button>
          </View>
        </View>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{i18n.t("changeLangulage")}</Text>

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

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          Application version: {Constants.manifest.version}
        </Text>
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
  itemText: {
    fontSize: 18,
  },
  inputContainer: {
    width: "100%",
  },
  inputText: {
    fontWeight: "normal",
    color: "black",
    marginLeft: 10,
  },
  inputElement: {
    minWidth: 50,
    marginRight: 30,
  },
  text: {
    color: Colors.gray700,
    textAlign: "center",
    marginTop: 10,
  },
  dropdown: {
    marginVertical: 10,
    width: "60%",
  },
  dbContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 6,
  },
  dbText: {
    flex: 1,
    // alignItems: "center",
  },
  dbButton: {
    marginHorizontal: 10,
  },
  versionContainer: {
    backgroundColor: Colors.orange800,
    padding: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  versionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});
