import { StatusBar } from "expo-status-bar";

import { useState, useEffect } from "react";
import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

import ConsumptionCalculator from "./screens/ConsumptionCalculator";
import SplitBill from "./screens/SplitBill";
import SaveConsumption from "./screens/SaveConsumption";
import ListDropdownItems from "./screens/ListDropdownItems";
import EditDropdownItem from "./screens/EditDropdownItem";
import Chart from "./screens/Chart";
import Settings from "./screens/Settings";

import { Colors } from "./constants/colors";
import { init } from "./util/database";
import { store } from "./store/store";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

function CalculatorOverview() {
  return (
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
        name="ConsumptionCalculator"
        component={ConsumptionCalculator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calculator" size={36} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="SplitBill"
        component={SplitBill}
        options={{
          title: "Split Bill",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={36} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Chart"
        component={Chart}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={32} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await init();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <>
      <StatusBar style="auto" />

      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              tabBarStyle: {
                height: 60,
                borderTopColor: Colors.gray100,
                borderTopWidth: 2,
                backgroundColor: Colors.gray50,
              },
              headerStyle: { backgroundColor: Colors.gray50 },
              headerTintColor: Colors.gray700,
            }}
          >
            <Stack.Screen
              name="CalculatorOverview"
              component={CalculatorOverview}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="SaveConsumption" component={SaveConsumption} />

            <Stack.Screen
              name="ListDropdownItems"
              component={ListDropdownItems}
            />

            <Stack.Screen
              name="EditDropdownItem"
              component={EditDropdownItem}
            />

            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
