import { useEffect, useState } from "react";

import { View, Text, TextInput, StyleSheet } from "react-native";

import { useDispatch } from "react-redux";

import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";
import { getAllVehicles } from "../store/vehicleOperations";
import { calculateConsumption } from "../util/calculations";
import { getVehicleNames } from "../util/database";

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
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadItems() {
      try {
        const vehicles = await getVehicleNames();

        dispatch(getAllVehicles(vehicles));
      } catch (err) {
        console.warn(err);
      }
    }

    loadItems();
  }, []);

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
          style={[
            styles.input,
            !inputs.kilometers.isValid && styles.invalidInput,
          ]}
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
          style={[styles.input, !inputs.liters.isValid && styles.invalidInput]}
          onChangeText={inputChangedHandler.bind(this, "liters")}
          placeholder="0"
          keyboardType="numeric"
          value={inputs.liters.value}
        />
      </View>

      <View style={styles.errorContainer}>
        {invalidFields && (
          <Text style={styles.errorText}>
            Invalid input values - please check your entered data!
          </Text>
        )}
      </View>

      <View style={styles.buttons}>
        <Button style={styles.button} onPress={clearHandler}>
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

      <View style={styles.buttons}>
        {!fuelConsumption ||
          (!invalidFields && <Button onPress={saveHandler}>Save Value</Button>)}
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
    fontWeight: "bold",
    textAlign: "right",
    padding: 6,
    marginRight: 20,
    minWidth: 120,
  },
  errorContainer: {
    height: 30,
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
