import { useEffect, useState, useLayoutEffect } from "react";

import { View, Text, StyleSheet } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import DropDownPicker from "react-native-dropdown-picker";

import { Colors } from "../constants/colors";

import IconButton from "../components/UI/IconButton";
import DrawChart from "../components/Chart/DrawChart";

import { useSelector } from "react-redux";
import { store } from "../store/store";
import { getVehicleData } from "../util/database";
import { formatDateForLabels } from "../util/datetime";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

const CHART_MAX_ELEMENTS = 6;
let page = 1;
let allPages = 1;

function Chart({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [data, setData] = useState({});
  const isFocused = useIsFocused();
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useEffect(() => {
    async function getItemsPerPage() {
      try {
        const value = await AsyncStorage.getItem("itemsPerPage");

        setItemsPerPage(+value);
      } catch (err) {
        console.warn(err);
      }
    }

    isFocused && getItemsPerPage();
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("chartScreen") });
  }, [langulage]);

  useLayoutEffect(() => {
    function loadItems() {
      const vehicles = store.getState().vehicleNames.vehicles;
      const dropdownData = vehicles.map((item) => {
        return { label: item, value: item };
      });

      setItems(dropdownData);
      setOpen(false);
      setData({});
      setValue(null);
      page = 1;
      allPages = 1;
    }

    loadItems();
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            icon="build"
            color={Colors.gray600}
            size={28}
            onPress={headerBttonPressHandler}
          />
        );
      },
    });
  }, [navigation, headerBttonPressHandler]);

  function headerBttonPressHandler() {
    navigation.navigate("Settings", { pages: itemsPerPage });
  }

  function prepareData(data) {
    const formatedData = {};

    formatedData.labels = Object.keys(data);
    formatedData.values = Object.values(data);

    return formatedData;
  }

  function formatLabels(data) {
    const formatLabels = data.labels.map((el, index) =>
      index === 0 ||
      Math.floor(data.labels.length / 2) === index ||
      index === data.labels.length - 1 ||
      data.labels.length < CHART_MAX_ELEMENTS
        ? formatDateForLabels(el)
        : ""
    );
    data.labels = formatLabels;

    return data;
  }

  function getDataPerPage(data, length) {
    const formatedData = {
      labels: data.labels.splice(
        -itemsPerPage * page,
        itemsPerPage * page - length > 0
          ? itemsPerPage - (itemsPerPage * page - length)
          : itemsPerPage
      ),
      values: data.values.splice(
        -itemsPerPage * page,
        itemsPerPage * page - length > 0
          ? itemsPerPage - (itemsPerPage * page - length)
          : itemsPerPage
      ),
    };

    return formatedData;
  }

  function processData(data, length) {
    const formatedData = prepareData(data);

    const pageData = getDataPerPage(formatedData, length);

    const pageLabels = formatLabels(pageData);

    setData(pageLabels);
  }

  async function selectedItemHandler(item, direction) {
    if (direction === "prev" && allPages >= page) page++;
    if (direction === "next" && page >= 1) page--;
    if (item.value) page = 1;

    try {
      const vehicleConsumption = await getVehicleData(item.value || value);

      if (itemsPerPage) {
        allPages = Math.ceil(
          Object.keys(vehicleConsumption).length / itemsPerPage
        );

        processData(vehicleConsumption, Object.keys(vehicleConsumption).length);
      } else {
        const pageData = prepareData(vehicleConsumption);

        const pageLabels = formatLabels(pageData);

        setData(pageLabels);
      }
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
          placeholder={i18n.t("saveConsumptionDropdown")}
          onSelectItem={(item) => {
            selectedItemHandler(item, "");
          }}
        />
      </View>

      <View>
        {Object.keys(data).length === 0 ? (
          <Text style={styles.chartText}>{i18n.t("chartView")}</Text>
        ) : (
          <>
            <DrawChart data={data} />
            <View style={styles.buttonsContainer}>
              <View>
                {page < allPages && (
                  <IconButton
                    icon="caret-back"
                    size={20}
                    color="white"
                    onPress={selectedItemHandler.bind(this, value, "prev")}
                    style={styles.button}
                  />
                )}
              </View>

              <View>
                {page > 1 && (
                  <IconButton
                    icon="caret-forward"
                    size={20}
                    color="white"
                    onPress={selectedItemHandler.bind(this, value, "next")}
                    style={styles.button}
                  />
                )}
              </View>
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 60,
  },
  button: {
    width: 100,
    backgroundColor: Colors.blue500,
    borderRadius: 10,
  },
});
