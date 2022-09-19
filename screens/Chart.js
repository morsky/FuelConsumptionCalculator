import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropDownPicker from "react-native-dropdown-picker";

import DrawChart from "../components/Chart/DrawChart";

import { store } from "../store/store";

import { getVehicleConsumption } from "../util/database";

function Chart() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [data, setData] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    function loadItems() {
      const vehicles = store.getState().vehicleNames.vehicles;
      const dropdownData = vehicles.map((item) => {
        return { label: item, value: item };
      });

      setItems(dropdownData);
      // setOpen(false);
      // setData({});
      // setValue(null);
    }

    isFocused && loadItems();
  }, [isFocused]);

  async function selectedItemHandler(item) {
    try {
      const vehicleConsumption = await getVehicleConsumption(item.value);

      setData(vehicleConsumption);
      console.log(vehicleConsumption);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View>
      <Text>Chart Screen</Text>

      <View>
        <Text>Example:</Text>

        <View>
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
            onSelectItem={(item) => {
              selectedItemHandler(item);
            }}
          />
        </View>

        {Object.keys(data).length === 0 ? (
          <Text>No Data</Text>
        ) : (
          <DrawChart data={data} />
        )}
      </View>
    </View>
  );
}

export default Chart;
