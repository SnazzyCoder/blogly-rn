import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import DataProvider from "./DataProvider";

import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MainScreen from "./screens/MainScreen";
import DetailScreen from "./screens/DetailScreen";
import AccountScreen from "./screens/AccountScreen";
import SearchScreen from "./screens/SearchScreen";
import ComposeScreen from "./screens/ComposeScreen";

const Stack = createSharedElementStackNavigator();

const App = () => {
  const HomeScreens = () => (
    <Stack.Navigator
      initialRouteName="MainScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={(navigation) => ({
          headerBackTitleVisible: false,
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
        })}
        sharedElementsConfig={(route) => {
          const { data } = route.params;
          return [
            {
              id: `item.${data.id}.photo`,
              animation: "move",
              resize: "clip",
              align: "center-top",
            },
            {
              id: `item.${data.id}.text`,
              animation: "fade",
              resize: "clip",
              align: "left-center",
            },
            {
              id: `item.${data.id}.profile`,
              animation: "move",
              resize: "clip",
              align: "left-center",
            },
            {
              id: `item.${data.id}.username`,
              animation: "fade",
              resize: "clip",
              align: "left-center",
            },
            {
              id: `item.${data.id}.readtime`,
              animation: "fade",
              resize: "clip",
              align: "left-center",
            },
          ];
        }}
      />
    </Stack.Navigator>
  );

  const Tab = createBottomTabNavigator();

  return (
    <DataProvider>
      <View style={{ flexGrow: 1 }}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                // You can return any component that you like here!
                return (
                  <Feather
                    name={
                      { Home: "home", Account: "user", Search: "search", Compose: "plus-circle" }[
                        route.name
                      ]
                    }
                    size={size}
                    color={color}
                  />
                );
              },
            })}
            tabBarOptions={{
              activeTintColor: "#b12341",
              inactiveTintColor: "gray",
              showLabel: false,
            }}
          >
            <Tab.Screen name="Home" component={HomeScreens} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Compose" component={ComposeScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </DataProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default App;
