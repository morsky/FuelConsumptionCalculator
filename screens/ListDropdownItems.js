import { View, Text, StyleSheet, FlatList } from "react-native";

import DropdownItem from "../components/Dropdown/DropdownItem";
import { Colors } from "../constants/colors";

import { useState } from "react";
import { useEffect } from "react";

function ListDropdownItems({ navigation, route, onEdit, onDelete }) {
  const [items, setItems] = useState(route.params.itemsArray);
  const [name, setName] = useState("");
  const newName = route.params.name;

  useEffect(() => {
    function render() {
      if (newName) {
        const newItems = items.map((item) => (item === name ? newName : item));

        setItems(newItems);
      }
    }

    render();
  }, [newName]);

  function onEdit(item) {
    setName(item);
    navigation.navigate("EditDropdownItem", { vehicle: item, names: items });
  }

  function onDelete(item) {
    const newData = items.filter((i) => i !== item);

    setItems(newData);
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
