import { useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList } from "react-native";

import DropdownItem from "../components/Dropdown/DropdownItem";

import { Colors } from "../constants/colors";

function ListDropdownItems({ route }) {
  const itemData = route.params.itemsArray;

  function renderDropdownItem(itemData) {
    return <DropdownItem {...itemData} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dropdown Items:</Text>
      {itemData.length === 0 ? (
        <Text style={styles.text}>No vehicles found!</Text>
      ) : (
        <FlatList
          data={itemData}
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
