import { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropDownPicker from "react-native-dropdown-picker";

import Button from "../components/UI/Button";
import IconButton from "../components/UI/IconButton";

import { Colors } from "../constants/colors";

import { Vehicle } from "../models/vehicle";

import { insertVehicleData } from "../util/database";
import { formatDate } from "../util/datetime";

import { useDispatch, useSelector } from "react-redux";
import { setVehicle } from "../store/vehicleObject";
import { store } from "../store/store";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

function SaveConsumption({ navigation, route }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const consumptionValue = route.params.value;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useEffect(() => {
    function loadItems() {
      const vehicles = store.getState().vehicleNames.vehicles;
      const dropdownData = vehicles.map((item) => {
        return { label: item, value: item };
      });

      setItems(dropdownData);
    }

    isFocused && loadItems();
  }, [isFocused]);

  useLayoutEffect(() => {
    setValue(null);
    setOpen(false);
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            icon="build"
            color={Colors.gray600}
            size={28}
            onPress={editHandler}
            style={styles.headerButton}
          />
        );
      },
    });
  }, [navigation, editHandler]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("saveConsumptionScreen") });
  }, [langulage]);

  async function saveHandler() {
    const dateTime = formatDate(new Date());
    const vehicle = new Vehicle(value, consumptionValue, dateTime);

    try {
      await insertVehicleData(vehicle);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  function editHandler() {
    dispatch(setVehicle({ name: "", consumption: consumptionValue }));

    navigation.navigate("ListDropdownItems");
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {`${i18n.t("consumption")}: ${consumptionValue.toFixed(2)} ${i18n.t(
            "unit"
          )}`}
        </Text>
      </View>

      <View style={styles.dropDownContainer}>
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
          placeholder={i18n.t("saveConsumptionDropdown")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button style={styles.buttonCancel} onPress={() => navigation.goBack()}>
          {i18n.t("cancelButton")}
        </Button>
        <Button style={styles.button} onPress={saveHandler} disabled={!value}>
          {i18n.t("saveButton")}
        </Button>
      </View>
    </View>
  );
}

export default SaveConsumption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: Colors.yellow100,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
  dropDownContainer: {
    marginHorizontal: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  buttonCancel: {
    backgroundColor: Colors.orange800,
  },
  headerButton: {
    marginRight: -15,
  },
});
