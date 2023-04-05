import { View, Text, StyleSheet, TextInput } from "react-native";

import { useState } from "react";

import { Colors } from "../constants/colors";

function Settings() {
  // const [text, setText] = useState("5");
  // const [isValid, setIsValid] = useState(true);
  const [inputs, setInputs] = useState({
    itemsPerPage: { value: 5, isValid: true },
  });
  const [editField, setEditField] = useState(false);

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
      Number.isInteger(itemsPerPage) && itemsPerPage > 0;

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
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Set Items Per Page</Text>
        <TextInput
          style={[styles.input, !inputs.itemsPerPage.isValid && styles.error]}
          placeholder="Enter Integer Number"
          defaultValue={inputs.itemsPerPage.value.toString()}
          keyboardType="numeric"
          onChangeText={inputChangedHandler.bind(this, "itemsPerPage")}
          onSubmitEditing={checkIUserInput}
          maxLength={6}
        />
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
    padding: 6,
    width: 100,
  },
  inputText: { fontSize: 18 },
  error: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
  },
});
