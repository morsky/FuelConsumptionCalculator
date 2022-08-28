import { useEffect, useState } from "react";

import { View, Text, StyleSheet } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";
import { Vehicle } from "../models/vehicle";
import { getVehicleNames, insertVehicleData } from "../util/database";
import { formatDate } from "../util/datetime";

function SaveConsumption({ navigation, route }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const consumptionValue = route.params.value;
  const defaultValues = [
    { label: "Car", value: "Car" },
    { label: "Motorbike", value: "Motorbike" },
    { label: "Truck", value: "Truck" },
  ];

  useEffect(() => {
    async function loadItems() {
      const items = await getVehicleNames();

      setItems(items);
    }

    loadItems();
  }, []);

  if (items.length === 0 || items.length < defaultValues.length) {
    setItems(defaultValues);
  }

  function Save() {
    const dateTime = formatDate(new Date());
    const item = new Vehicle(value, consumptionValue, dateTime);

    insertVehicleData(item);

    console.log(item);

    navigation.goBack();
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
