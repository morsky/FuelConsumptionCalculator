import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import Button from "../components/UI/Button";

import { calculateConsumption } from "../util/calculations";

function ConsumptionCalculator() {
  const [kilometersInput, setKilometersInput] = useState("");
  const [litersInput, setLitersInput] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState(0);

  function Calculate() {
    setFuelConsumption(calculateConsumption(kilometersInput, litersInput));
  }

  function Clear() {
    setKilometersInput("");
    setLitersInput("");
    setFuelConsumption(0);
  }

  function inputField(setInput, input, label) {
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(text) => setInput(text)}
          value={input}
        ></TextInput>
      </View>
    );
  }

  return (
    <View>
      <Text>Calculate Fuel Consumption Screen</Text>

      {inputField(setKilometersInput, kilometersInput, "Enter kilometers:")}
      {inputField(setLitersInput, litersInput, "Enter liters:")}

      <View>
        <Button onPress={Calculate}>Calculate</Button>
        <Button onPress={Clear}>Clear</Button>
      </View>

      <View>
        <Text>
          100 km / l:{" "}
          {fuelConsumption === 0 ? fuelConsumption : fuelConsumption.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export default ConsumptionCalculator;
