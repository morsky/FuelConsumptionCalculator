import { useEffect, useState } from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import DropdownItem from "../components/Dropdown/DropdownItem";

import { Colors } from "../constants/colors";

import { useDispatch } from "react-redux";
import { store } from "../store/store";
import { removeVehicle } from "../store/vehicles";

function ListDropdownItems({ navigation, onEdit, onDelete }) {
  const [items, setItems] = useState(store.getState().vehicleNames.vehicles);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && setItems(store.getState().vehicleNames.vehicles);
  }, [isFocused]);

  function onEdit(name) {
    navigation.navigate("EditDropdownItem", { vehicle: name });
  }

  function onDelete(name) {
    dispatch(removeVehicle(name));
    setItems(store.getState().vehicleNames.vehicles);
  }

  function renderDropdownItem(itemData) {
    return <DropdownItem {...itemData} onEdit={onEdit} onDelete={onDelete} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dropdown Items:</Text>
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
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    marginLeft: 20,
  },
});
