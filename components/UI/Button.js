import { Pressable, Text, StyleSheet } from "react-native";

import { Colors } from "../../constants/colors";

function Button({ children, onPress, disabled, style }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    margin: 4,
    backgroundColor: Colors.blue500,
    elevation: 8,
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  disabled: {
    opacity: 0.7,
  },
});
