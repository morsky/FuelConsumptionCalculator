import { useEffect, useState, useLayoutEffect } from "react";

import { View, Text, StyleSheet, Keyboard } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch, useSelector } from "react-redux";

import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";

import { getAllVehicles } from "../store/vehicleOperations";
import { setLangulage } from "../store/langulage";

import { calculateConsumption } from "../util/calculations";
import { getVehicleNames } from "../util/database";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

function ConsumptionCalculator({ navigation }) {
  const [inputs, setInputs] = useState({
    kilometers: {
      value: "",
      isValid: true,
    },
    liters: {
      value: "",
      isValid: true,
    },
  });
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const langulage = useSelector((state) => state.langulage)?.langulage;
  const dispatch = useDispatch();

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useEffect(() => {
    async function loadItems() {
      try {
        const vehicles = await getVehicleNames();

        dispatch(getAllVehicles(vehicles));

        const lang = await AsyncStorage.getItem("langulage");

        dispatch(setLangulage(lang));

        i18n.locale = lang;
      } catch (err) {
        console.warn(err);
      }
    }

    loadItems();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("consumptionCalculatorScreen") });
  }, [langulage]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function calculateHandler() {
    Keyboard.dismiss();

    const inputData = {
      kilometers: +inputs.kilometers.value,
      liters: +inputs.liters.value,
    };

    const kilometersIsValid =
      !isNaN(inputData.kilometers) && inputData.kilometers > 0;
    const litersIsValid = !isNaN(inputData.liters) && inputData.liters > 0;

    if (!kilometersIsValid || !litersIsValid) {
      setInputs((curInputs) => {
        return {
          kilometers: {
            value: curInputs.kilometers.value,
            isValid: kilometersIsValid,
          },
          liters: { value: curInputs.liters.value, isValid: litersIsValid },
        };
      });

      setFuelConsumption(0);

      return;
    }

    const fuelConsumption = calculateConsumption({
      kilometers: inputs.kilometers.value,
      liters: inputs.liters.value,
    });

    setFuelConsumption(fuelConsumption);
  }

  async function saveHandler() {
    navigation.navigate("SaveConsumption", {
      value: fuelConsumption,
    });
  }

  function clearHandler() {
    setInputs({
      kilometers: { value: "", isValid: true },
      liters: { value: "", isValid: true },
    });
    setFuelConsumption(0);
  }

  const invalidFields = !inputs.kilometers.isValid || !inputs.liters.isValid;

  return (
    <View style={styles.container}>
      <Input
        label={i18n.t("kilometersInput")}
        invalid={!inputs.kilometers.isValid}
        textInputConfig={{
          onChangeText: inputChangedHandler.bind(this, "kilometers"),
          placeholder: "0",
          keyboardType: "numeric",
          value: inputs.kilometers.value,
          maxLength: 10,
        }}
      />

      <Input
        label={i18n.t("litersInput")}
        invalid={!inputs.liters.isValid}
        textInputConfig={{
          onChangeText: inputChangedHandler.bind(this, "liters"),
          placeholder: "0",
          keyboardType: "numeric",
          value: inputs.liters.value,
          maxLength: 10,
        }}
      />

      <View style={styles.errorContainer}>
        {invalidFields && (
          <Text style={styles.errorText}>{i18n.t("errorInputsMsg")}</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <Button
          style={[styles.button, styles.buttonClear]}
          onPress={clearHandler}
        >
          {i18n.t("clearButton")}
        </Button>
        <Button style={styles.button} onPress={calculateHandler}>
          {i18n.t("calculateButton")}
        </Button>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.label}>
          {`${i18n.t("litersPer100km")}: ${
            fuelConsumption === 0 ? fuelConsumption : fuelConsumption.toFixed(2)
          }`}
        </Text>
      </View>

      <View style={styles.buttons}>
        {!fuelConsumption ||
          (!invalidFields && (
            <Button onPress={saveHandler}>{i18n.t("saveButton")}</Button>
          ))}
      </View>
    </View>
  );
}

export default ConsumptionCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow100,
    paddingTop: 40,
  },
  errorContainer: {
    height: 40,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: Colors.error200,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray700,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  buttonClear: {
    backgroundColor: Colors.orange800,
  },
  resultContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
