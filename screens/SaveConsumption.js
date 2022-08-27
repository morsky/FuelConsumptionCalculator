import { useState } from "react";

import { View, Text, StyleSheet } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";

function SaveConsumption({ navigation, route }) {
  const consumptionValue = route.params.value;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Car", value: "car" },
    { label: "Motorbike", value: "motorbike" },
  ]);

  function Save() {
    const currentDate = new Date();
    const dateTime = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")} ${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${currentDate.getMilliseconds()}`;

    const item = {
      vehicle: value,
      consumption: consumptionValue,
      date: dateTime,
    };

    console.log(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Consumption: {consumptionValue.toFixed(2)} l/km
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
          placeholder="Select a vehicle"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.goBack()}>Cancel</Button>
        <Button style={styles.button} onPress={Save} disabled={!value}>
          Save
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
});
