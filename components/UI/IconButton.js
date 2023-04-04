import { Pressable, View, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/colors";

function IconButton({ icon, size, color, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.buttonContainer, style]}>
        <Ionicons name={icon} size={size} color={color} style={styles.text} />
      </View>
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    margin: 4,
    backgroundColor: Colors.blue500,
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    textAlign: "center",
  },
});
