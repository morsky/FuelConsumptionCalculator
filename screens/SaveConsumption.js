import { View, Text, TextInput, StyleSheet } from "react-native";

function SaveConsumption({ route }) {
  const value = route.params.value;

  return (
    <View>
      <Text>Save Consumption Screen - {value}</Text>
    </View>
  );
}

export default SaveConsumption;
