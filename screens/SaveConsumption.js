import { useEffect, useState } from "react";

import { View, Text, StyleSheet } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropDownPicker from "react-native-dropdown-picker";
import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";
import { Vehicle } from "../models/vehicle";
import { getVehicleNames, insertVehicleData } from "../util/database";
import { formatDate } from "../util/datetime";

import { setVehicles } from "../store/vehicles";
import { useDispatch } from "react-redux";

function SaveConsumption({ navigation, route }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const consumptionValue = route.params.value;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadItems() {
      try {
        const items = await getVehicleNames();

        dispatch(setVehicles(items));

        const dropdownData = items.map((item) => {
          return { label: item, value: item };
        });

        setItems(dropdownData);
      } catch (error) {
        console.log(error);
      }
    }

    isFocused && loadItems();
  }, [isFocused]);

  async function save() {
    const dateTime = formatDate(new Date());
    const vehicle = new Vehicle(value, consumptionValue, dateTime);

    try {
      await insertVehicleData(vehicle);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
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

        <Button onPress={() => navigation.navigate("ListDropdownItems")}>
          Edit
        </Button>

        <Button
          onPress={() => {
            navigation.navigate("EditDropdownItem", {
              vehicle: "",
              value: consumptionValue,
            });
          }}
        >
          Add New Vehicle
        </Button>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.goBack()}>Cancel</Button>
        <Button style={styles.button} onPress={save} disabled={!value}>
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
