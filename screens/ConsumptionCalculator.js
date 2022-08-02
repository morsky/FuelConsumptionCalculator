import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import Button from "../components/UI/Button";

import { calculateConsumption } from "../util/calculations";
import { GlobalStyles } from "../constants/styles";

function ConsumptionCalculator() {
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

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function calculateHandler() {
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

  const invalidFields = !inputs.kilometers.isValid || !inputs.liters.isValid;

  function Clear() {
    setInputs({
      kilometers: { value: "", isValid: true },
      liters: { value: "", isValid: true },
    });
    setFuelConsumption(0);
  }

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text
          style={[
            styles.label,
            !inputs.kilometers.isValid && styles.invalidLabel,
          ]}
        >
          Enter kilometers:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={inputChangedHandler.bind(this, "kilometers")}
          placeholder="0"
          keyboardType="numeric"
          value={inputs.kilometers.value}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text
          style={[styles.label, !inputs.liters.isValid && styles.invalidLabel]}
        >
          Enter liters:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={inputChangedHandler.bind(this, "liters")}
          placeholder="0"
          keyboardType="numeric"
          value={inputs.liters.value}
        />
      </View>

      <View style={styles.buttons}>
        <Button style={styles.button} onPress={Clear}>
          Clear
        </Button>
        <Button style={styles.button} onPress={calculateHandler}>
          Calculate
        </Button>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.label}>
          l/100km:{" "}
          {fuelConsumption === 0 ? fuelConsumption : fuelConsumption.toFixed(2)}
        </Text>
      </View>

      {invalidFields && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
    </View>
  );
}

export default ConsumptionCalculator;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 4,
    marginVertical: 8,
    // backgroundColor: "yellow",
    // width: "80%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",

    // color: GlobalStyles.colors.primary100,
    // marginBottom: 4,
  },
  input: {
    // backgroundColor: GlobalStyles.colors.primary100,
    // color: GlobalStyles.colors.primary700,
    borderRadius: 6,
    borderWidth: 2,
    fontSize: 18,
    textAlign: "right",
    padding: 6,
    // marginRight: "20%",
    minWidth: 120,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
    marginTop: 20,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  resultContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
