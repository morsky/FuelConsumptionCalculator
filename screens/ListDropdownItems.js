import { useEffect, useState } from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropdownItem from "../components/Dropdown/DropdownItem";
import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";

import { useDispatch } from "react-redux";
import { store } from "../store/store";
import { removeVehicle } from "../store/vehicles";
import { setVehicle, setVehicleName } from "../store/vehicleObject";

function ListDropdownItems({ navigation, onEdit, onDelete }) {
  const [items, setItems] = useState(store.getState().vehicleNames.vehicles);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && setItems(store.getState().vehicleNames.vehicles);
  }, [isFocused]);

  function onEdit(name) {
    dispatch(setVehicleName(name));
    navigation.navigate("EditDropdownItem");
  }

  function onDelete(name) {
    dispatch(removeVehicle(name));
    setItems(store.getState().vehicleNames.vehicles);
  }

  function onAdd() {
    dispatch(setVehicleName(""));
    navigation.navigate("EditDropdownItem");
  }

  function renderDropdownItem(itemData) {
    return <DropdownItem {...itemData} onEdit={onEdit} onDelete={onDelete} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Dropdown Items:</Text>

        <Button onPress={onAdd}>Add Vehicle</Button>
      </View>

      {items.length === 0 ? (
        <Text style={styles.text}>No vehicles found!</Text>
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
