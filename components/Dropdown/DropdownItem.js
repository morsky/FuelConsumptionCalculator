import { View, Text, StyleSheet, Alert } from "react-native";

import Button from "../UI/Button";

import { Colors } from "../../constants/colors";

import { deleteVehicle } from "../../util/database";

function DropdownItem({ item, onDelete, onEdit }) {
  function EditItem() {
    onEdit(item);
  }

  function DeleteItem() {
    Alert.alert(
      "Delete Confurmation",
      "Are you sure? The item and all of it's data will be deleted!",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            onDelete(item);
            deleteVehicle(item);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={EditItem}>Edit</Button>
          <Button onPress={DeleteItem}>Delete</Button>
        </View>
      </View>
    </View>
  );
}

export default DropdownItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray700,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textContainer: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
