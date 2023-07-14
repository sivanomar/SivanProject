import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignUp from "./components/SignupScreen";
import ContactScreen from "./components/contactScreen";
import Login from "./components/LoginScreen";
import FlatListDemo from "./components/Flatlistdemo";
import Logout from "./components/Logout";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function LoggedInNav()
{
  return (
    <BottomTab.Navigator
      initialRouteName="Contact"
      screenOptions={{ headerShown: true }}
    >
      <BottomTab.Screen name="Contact" component={ContactScreen} />
      <BottomTab.Screen name="FlatList" component={FlatListDemo} />
      <BottomTab.Screen name="Logout" component={Logout} />
    </BottomTab.Navigator>
  );
}

function App()
{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Logout"
          component={Logout}
          options={{ title: "Login Screen" }}
        />

        <Stack.Screen
          name="LoggedInNav"
          component={LoggedInNav}
          options={{
            title: "Contact Screen",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login Screen" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign Up Screen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
