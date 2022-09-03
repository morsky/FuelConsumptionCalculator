import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import Button from "../components/UI/Button";
import { Colors } from "../constants/colors";
import { Vehicle } from "../models/vehicle";

import { insertVehicleData, updateVehicleName } from "../util/database";
import { formatDate } from "../util/datetime";

function EditDropdownItem({ navigation, route }) {
  const oldName = route.params.vehicle;
  const consumption = route.params.value;
  const allNames = route.params.names;
  const [inputs, setInputs] = useState({
    newName: {
      value: oldName,
      isValid: true,
      message: "",
    },
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, message: "" },
      };
    });
  }

  async function done() {
    if (inputs.newName.value === "") {
      setInputs((curInputs) => {
        return {
          newName: {
            value: curInputs.newName.value,
            isValid: false,
            message: "Name should not be empty string!",
          },
        };
      });

      return;
    }

    if (allNames.includes(inputs.newName.value)) {
      setInputs((curInputs) => {
        return {
          newName: {
            value: curInputs.newName.value,
            isValid: false,
            message: "Name already exists! Try another one!",
          },
        };
      });

      return;
    }

    if (oldName === "") {
      const newVehicle = new Vehicle(
        inputs.newName.value,
        consumption,
        formatDate(new Date())
      );
      try {
        insertVehicleData(newVehicle);
        navigation.navigate("ConsumptionCalculator");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        updateVehicleName(oldName, inputs.newName.value);

        navigation.navigate("ListDropdownItems", {
          name: inputs.newName.value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  function cancel() {
    navigation.goBack();
  }

  const invalidFields = !inputs.newName.isValid;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, invalidFields && styles.invalidLabel]}>
        {oldName === "" ? "Type Vehicle Name:" : "Rename Vehicle:"}
      </Text>

      <TextInput
        style={[styles.input, invalidFields && styles.invalidInput]}
        onChangeText={inputChangedHandler.bind(this, "newName")}
        value={inputs.newName.value}
        // placeholder="Name"
      />

      <View style={styles.errorContainer}>
        {invalidFields && (
          <Text style={[styles.errorText, invalidFields && styles.errorText]}>
            {inputs.newName.message}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={cancel}>Cancel</Button>
        <Button onPress={done}>OK</Button>
      </View>
    </View>
  );
}

export default EditDropdownItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow100,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  input: {
    borderColor: Colors.gray700,
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  errorContainer: {
    height: 30,
    marginTop: 10,
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
});
