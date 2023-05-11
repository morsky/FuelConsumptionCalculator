import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/colors";

function Input({
  label,
  textInputConfig,
  invalid,
  containerStyle,
  textStyle,
  inputStyle,
}) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Text style={[styles.label, textStyle, invalid && styles.invalidLabel]}>
        {label}
      </Text>

      <TextInput
        style={[styles.input, inputStyle, invalid && styles.invalidInput]}
        {...textInputConfig}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray700,
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
    marginRight: 20,
    minWidth: 120,
  },
  invalidLabel: {
    color: Colors.error200,
  },
  invalidInput: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
  },
});
