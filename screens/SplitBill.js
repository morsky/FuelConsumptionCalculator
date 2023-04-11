import { useState, useLayoutEffect } from "react";

import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";

import { Colors } from "../constants/colors";

import Button from "../components/UI/Button";

import { calculatePricePerPerson } from "../util/calculations";

import { useSelector } from "react-redux";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

function SplitBill({ navigation }) {
  const [inputs, setInputs] = useState({
    cost: {
      value: "",
      isValid: true,
    },
    persons: {
      value: "",
      isValid: true,
    },
  });
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("splitBillScreen") });
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
      cost: +inputs.cost.value,
      persons: +inputs.persons.value,
    };

    const costIsValid = !isNaN(inputData.cost) && inputData.cost > 0;
    const personsIsValid = !isNaN(inputData.persons) && inputData.persons > 0;

    if (!costIsValid || !personsIsValid) {
      setInputs((curInputs) => {
        return {
          cost: {
            value: curInputs.cost.value,
            isValid: costIsValid,
          },
          persons: { value: curInputs.persons.value, isValid: personsIsValid },
        };
      });

      setFuelConsumption(0);

      return;
    }

    const fuelConsumption = calculatePricePerPerson({
      cost: inputs.cost.value,
      persons: inputs.persons.value,
    });
    setFuelConsumption(fuelConsumption);
  }

  const invalidFields = !inputs.cost.isValid || !inputs.persons.isValid;

  function clearHandler() {
    setInputs({
      cost: { value: "", isValid: true },
      persons: { value: "", isValid: true },
    });
    setFuelConsumption(0);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text
          style={[styles.label, !inputs.cost.isValid && styles.invalidLabel]}
        >
          {`${i18n.t("enterCost")}:`}
        </Text>
        <TextInput
          style={[styles.input, !inputs.cost.isValid && styles.invalidInput]}
          onChangeText={inputChangedHandler.bind(this, "cost")}
          placeholder="0"
          keyboardType="numeric"
          value={inputs.cost.value}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text
          style={[styles.label, !inputs.persons.isValid && styles.invalidLabel]}
        >
          {`${i18n.t("enterPerson")}:`}
        </Text>
        <TextInput
          style={[styles.input, !inputs.persons.isValid && styles.invalidInput]}
          onChangeText={inputChangedHandler.bind(this, "persons")}
          placeholder="0"
          keyboardType="numeric"
          value={inputs.persons.value}
        />
      </View>

      <View style={styles.errorContainer}>
        {invalidFields && (
          <Text style={styles.errorText}>{i18n.t("errorInputsMsg")}</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <Button style={styles.button} onPress={clearHandler}>
          {i18n.t("clearButton")}
        </Button>
        <Button style={styles.button} onPress={calculateHandler}>
          {i18n.t("calculateButton")}
        </Button>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.label}>
          {`${i18n.t("costPerPerson")}: ${
            fuelConsumption === 0 ? fuelConsumption : fuelConsumption.toFixed(2)
          }`}
        </Text>
      </View>
    </View>
  );
}

export default SplitBill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green100,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray700,
  },
  input: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.gray100,
    backgroundColor: Colors.yellow50,
    color: Colors.gray700,
    fontSize: 18,
    textAlign: "right",
    padding: 6,
    marginRight: 20,
    minWidth: 120,
  },
  errorContainer: {
    height: 60,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: Colors.error200,
  },
  invalidLabel: {
    color: Colors.error200,
  },
  invalidInput: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
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
  resultContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
