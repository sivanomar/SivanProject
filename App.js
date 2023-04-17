import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import Login from "./components/loginScreen";
import SignUp from "./components/signupScreen";
import contactsScreen from "./components/contactScreen"; 
import ContactsScreen from "./components/contactScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={ContactsScreen}
          options={{ title: 'Login Screen' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: 'Sign Up Screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;