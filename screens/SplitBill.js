import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import Button from "../components/UI/Button";

import { calculatePricePerPerson } from "../util/calculations";
import { Colors } from "../constants/colors";

function SplitBill() {
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

  function Clear() {
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
          Enter cost:
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
          Enter persons:
        </Text>
        <TextInput
          style={[styles.input, !inputs.persons.isValid && styles.invalidInput]}
          onChangeText={inputChangedHandler.bind(this, "persons")}
          placeholder="0"
          keyboardType="numeric"
          value={inputs.persons.value}
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
          Cost per person:{" "}
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
  errorText: {
    textAlign: "center",
    color: Colors.error200,
    margin: 8,
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
