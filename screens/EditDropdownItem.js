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
  const [newName, setNewName] = useState(oldName);

  function changeTextHandler(enteredText) {
    // TODO Check user input
    setNewName(enteredText);
  }

  async function done() {
    if (oldName === "") {
      const newVehicle = new Vehicle(
        newName,
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
        updateVehicleName(oldName, newName);
        // navigation.goBack();
        navigation.navigate("ListDropdownItems", { itemsArray: [newName] });
      } catch (error) {
        console.log(error);
      }
    }
  }

  function cancel() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {oldName === "" ? "Type Vehicle Name:" : "Rename Vehicle:"}
      </Text>

      <TextInput
        style={styles.input}
        onChangeText={changeTextHandler}
        value={newName}
      />

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
    marginTop: 20,
  },
});
