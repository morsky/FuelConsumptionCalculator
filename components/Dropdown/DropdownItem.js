import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Alert } from "react-native";

import { Colors } from "../../constants/colors";
import { deleteVehicle } from "../../util/database";

import Button from "../UI/Button";

function DropdownItem({ item }) {
  const navigation = useNavigation();

  function DeleteItem() {
    Alert.alert(
      "Delete Confurmation",
      "Are you sure? The item and all of it's data will be deleted!",
      [
        { text: "Cancel" },
        {
          text: "Delte",
          onPress: () => {
            deleteVehicle(item);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.text}>{item}</Text>
        <View style={styles.buttonContainer}>
          <Button>Edit</Button>
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
