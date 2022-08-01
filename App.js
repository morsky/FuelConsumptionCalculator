import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import ConsumptionCalculator from "./screens/ConsumptionCalculator";
import SplitBill from "./screens/SplitBill";

const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />

      <NavigationContainer>
        <BottomTabs.Navigator
          screenOptions={{
            tabBarStyle: { height: 60 },
            tabBarShowLabel: false,
          }}
        >
          <BottomTabs.Screen
            name="Consumption Calculator"
            component={ConsumptionCalculator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="calculator" size={36} color={color} />
              ),
            }}
          />
          <BottomTabs.Screen
            name="Split Bill"
            component={SplitBill}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="people-sharp" size={36} color={color} />
              ),
            }}
          />
        </BottomTabs.Navigator>
      </NavigationContainer>
    </>
  );
}
