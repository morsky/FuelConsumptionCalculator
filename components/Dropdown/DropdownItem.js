import { View, Text, StyleSheet } from "react-native";

import { Colors } from "../../constants/colors";

import IconButton from "../UI/IconButton";

function DropdownItem({ item, onDelete, onEdit }) {
  function editItemHandler() {
    onEdit(item);
  }

  function DeleteItemHandler() {
    onDelete(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <IconButton
            style={[styles.button, styles.buttonOrange]}
            icon="create-outline"
            color={Colors.gray50}
            size={28}
            onPress={editItemHandler}
          />
          <IconButton
            style={[styles.button, styles.buttonRed]}
            icon="trash-outline"
            color={Colors.gray50}
            size={28}
            onPress={DeleteItemHandler}
          />
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
    flexDirection: "column",
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
    color: Colors.gray600,
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    color: "white",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    margin: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    elevation: 4,
  },
  buttonOrange: {
    backgroundColor: Colors.orange700,
  },
  buttonRed: {
    backgroundColor: "red",
  },
});
