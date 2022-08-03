import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import ConsumptionCalculator from "./screens/ConsumptionCalculator";
import SplitBill from "./screens/SplitBill";

import { Colors } from "./constants/colors";

const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />

      <NavigationContainer>
        <BottomTabs.Navigator
          screenOptions={{
            tabBarStyle: {
              height: 60,
              borderTopColor: Colors.gray100,
              borderTopWidth: 2,
              backgroundColor: Colors.gray50,
            },
            tabBarShowLabel: false,
            headerStyle: { backgroundColor: Colors.gray50 },
            headerTintColor: Colors.gray700,
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
