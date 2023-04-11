import { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropdownItem from "../components/Dropdown/DropdownItem";
import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";

import { deleteVehicle } from "../util/database";

import { useDispatch, useSelector } from "react-redux";
import { store } from "../store/store";
import { removeVehicle } from "../store/vehicleOperations";
import { setVehicleName } from "../store/vehicleObject";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

function ListDropdownItems({ navigation, onEdit, onDelete }) {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useLayoutEffect(() => {
    isFocused && setItems(store.getState().vehicleNames.vehicles);
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("listDropdownItemsScreen") });
  }, [langulage]);

  function onEdit(name) {
    dispatch(setVehicleName(name));
    navigation.navigate("EditDropdownItem");
  }

  function onDelete(name) {
    Alert.alert(
      i18n.t("deleteVehicleAlertTitle"),
      i18n.t("deleteVehicleAlertText"),
      [
        { text: i18n.t("cancelButton") },
        {
          text: i18n.t("deleteButton"),
          onPress: () => {
            deleteVehicle(name);
            dispatch(removeVehicle(name));
            setItems(store.getState().vehicleNames.vehicles);
          },
        },
      ]
    );
  }

  function addHandler() {
    dispatch(setVehicleName(""));
    navigation.navigate("EditDropdownItem");
  }

  function renderDropdownItem(itemData) {
    return <DropdownItem {...itemData} onEdit={onEdit} onDelete={onDelete} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{`${i18n.t("vehicles")}:`}</Text>

        <Button onPress={addHandler}>{i18n.t("addButton")}</Button>
      </View>

      {items.length === 0 ? (
        <Text style={styles.text}>{i18n.t("noVehiclesFoundMsg")}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(_, index) => index}
          renderItem={renderDropdownItem}
        />
      )}
    </View>
  );
}

export default ListDropdownItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.gray700,
    borderBottomWidth: 2,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray700,
    marginVertical: 20,
  },
});
