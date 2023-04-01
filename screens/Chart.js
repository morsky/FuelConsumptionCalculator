import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropDownPicker from "react-native-dropdown-picker";

import DrawChart from "../components/Chart/DrawChart";

import { store } from "../store/store";

import { getVehicleConsumption, getVehiclesPerPage } from "../util/database";
import { formatDateForLabels } from "../util/datetime";
import { Colors } from "../constants/colors";

const CHART_MAX_ELEMENTS = 6;
const itemsPerPage = 5;
let page = 0;

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
      page = 0;
    }

    isFocused && loadItems();
  }, [isFocused]);

  function prepareData(data) {
    const formatedData = {};

    formatedData.labels = Object.keys(data);
    formatedData.values = Object.values(data);

    const formatLabels = formatedData.labels.map((el, index) =>
      index === 0 ||
      Math.round(formatedData.labels.length / 2) === index ||
      index === formatedData.labels.length - 1 ||
      formatedData.labels.length < CHART_MAX_ELEMENTS
        ? formatDateForLabels(el)
        : ""
    );

    formatedData.labels = formatLabels;

    return formatedData;
  }

  async function selectedItemHandler(item, itemsPerPage) {
    try {
      // let vehicleConsumption;

      // console.log(item.value, itemsPerPage, page);

      // if (itemsPerPage) {
      //   vehicleConsumption = await getVehiclesPerPage(
      //     value ? value : item.value,
      //     itemsPerPage,
      //     page
      //   );
      // } else {
      //   vehicleConsumption = await getVehicleConsumption(item.value);
      // }

      // // console.log(vehicleConsumption);
      // if (item.value) page = 0;
      // else page += itemsPerPage;

      const vehicleConsumption = await getVehicleConsumption(item.value);
      const data = prepareData(vehicleConsumption);

      setData(data);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdown}>
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
            selectedItemHandler(item, itemsPerPage);
          }}
        />
      </View>

      <View>
        {Object.keys(data).length === 0 ? (
          <Text style={styles.chartText}>Chart View</Text>
        ) : (
          <>
            <DrawChart data={data} />
            <View>
              <Button
                title="Prev"
                onPress={selectedItemHandler.bind(this, value, itemsPerPage)}
              ></Button>
              {/* <Button title="Next" onPress={switchPageHandler}></Button> */}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default Chart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange50,
  },
  dropdown: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
  chartText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray700,
    width: "100%",
    textAlign: "center",
  },
});
