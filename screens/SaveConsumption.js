import { useState } from "react";

import { View, Text, TextInput, StyleSheet } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

import Button from "../components/UI/Button";

function SaveConsumption({ navigation, route }) {
  const consumptionValue = route.params.value;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Car", value: "car" },
    { label: "Motorbike", value: "motorbike" },
  ]);

  function Save() {
    const item = { vehicle: value, consumption: consumptionValue };

    console.log(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Consumption: {consumptionValue.toFixed(2)} l/km
        </Text>
      </View>

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
    marginHorizontal: 40,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
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
