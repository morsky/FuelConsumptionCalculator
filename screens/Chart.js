import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

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
      setOpen(false);
      setData({});
      setValue(null);
    }

    isFocused && loadItems();
  }, [isFocused]);

  function format(element) {
    const items = element.split("-");

    const newFormat = `${items[2]}/${items[1]}/${items[0].slice(-2)}`;

    return newFormat;
  }

  async function selectedItemHandler(item) {
    try {
      const vehicleConsumption = await getVehicleConsumption(item.value);

      const data = {};

      data.labels = Object.keys(vehicleConsumption);
      data.values = Object.values(vehicleConsumption);

      const formatLabels = data.labels.map((el, index) =>
        index === 0 || index === data.labels.length - 1 ? format(el) : ""
      );

      data.labels = formatLabels;

      setData(data);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View>
      <View>
        <View>
          <Text>Select vehicle:</Text>
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
          <View>
            <DrawChart data={data} />
          </View>
        )}
      </View>
    </View>
  );
}

export default Chart;
