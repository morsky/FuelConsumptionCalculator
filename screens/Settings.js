import { View, Text, StyleSheet, TextInput } from "react-native";

import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../constants/colors";

function Settings({ route }) {
  const [inputs, setInputs] = useState({
    itemsPerPage: { value: route.params.pages, isValid: true },
  });

  function inputChangedHandler(enteredText) {
    setText(enteredText);
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function checkIUserInput() {
    const itemsPerPage = +inputs.itemsPerPage.value;

    const itemsPerPageisValid =
      Number.isInteger(itemsPerPage) && itemsPerPage >= 0;

    if (!itemsPerPageisValid) {
      inputs.itemsPerPage.isValid = itemsPerPageisValid;
      setInputs((curInputs) => {
        return {
          itemsPerPage: {
            value: curInputs.itemsPerPage.value,
            isValid: itemsPerPageisValid,
          },
        };
      });
    }

    storeData(itemsPerPage.toString());
  }

  async function storeData(value) {
    try {
      await AsyncStorage.setItem("itemsPerPage", value);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Set Items Per Page</Text>

          <TextInput
            style={[styles.input, !inputs.itemsPerPage.isValid && styles.error]}
            defaultValue={inputs.itemsPerPage.value.toString()}
            keyboardType="numeric"
            onChangeText={inputChangedHandler.bind(this, "itemsPerPage")}
            onSubmitEditing={checkIUserInput}
            maxLength={3}
          />
        </View>

        <Text style={styles.text}>To view all data set Items Per Page = 0</Text>
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
  },
  input: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.gray100,
    backgroundColor: Colors.yellow50,
    color: Colors.gray700,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 60,
  },
  inputText: {
    fontSize: 18,
  },
  text: {
    color: Colors.gray700,
    textAlign: "center",
    marginTop: 5,
    marginHorizontal: 10,
  },
  itemContainer: {
    borderBottomColor: Colors.gray600,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
  },
  error: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
  },
});
