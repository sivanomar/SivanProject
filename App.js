import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignupScreen from "./components/SignupScreen";
import ContactScreen from "./components/ContactScreen";
import LoginScreen from "./components/LoginScreen";
import UpdateProfile from "./components/UpdateProfile";
import FlatListDemo from "./components/Chat";
import Logout from "./components/Logout";
import BlockedUsers from "./components/BlockedUsers";
import SearchContacts from "./components/SearchContacts";
import ChatList from "./components/Chat";
import SendMessage from "./components/SendMessage";
import CreateChat from "./components/CreateChat";
import AddUsersInChat from "./components/AddUsersInChat";





import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function LoggedInNav()
{
  return (
    <BottomTab.Navigator
      initialRouteName="Chats"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) =>
        {
          let iconName;

          if (route.name === "Contacts")
          {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Chat")
          {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Logout")
          {
            iconName = focused ? "log-out" : "log-out-outline";
          } else if (route.name === "Search Contacts")
          {
            iconName = focused ? "search" : "search-outline";
          }


          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="Contacts" component={ContactScreen} />
      <BottomTab.Screen name="Chat" component={FlatListDemo} />
      <BottomTab.Screen name="Search Contacts" component={SearchContacts} />
      {/* <BottomTab.Screen name="Logout" component={Logout} /> */}
      {/* <BottomTab.Screen name="Blocked Users" component={BlockedUsers} /> */}
      <BottomTab.Screen name="Chats" component={ChatList} />
      <BottomTab.Screen name="Create Chat" component={CreateChat} />
      <BottomTab.Screen name="Send Message" component={SendMessage} />
      
      <BottomTab.Screen name="Add User In Chat" component={AddUsersInChat} />


    </BottomTab.Navigator>
  );
}

function App()
{
  useEffect(() =>
  {
    checkToken();
  }, []);

  const checkToken = async () =>
  {
    try
    {
      const token = await AsyncStorage.getItem("whatsthat_session_token");

      if (token)
      {
        // Token found, navigate to private route
        // navigation.navigate("LoggedInNav");
      } else
      {
        // Token not found, navigate to login
        // navigation.navigate("Login");
      }
    } catch (error)
    {
      console.log(error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoggedInNav">
        <Stack.Screen
          name="LoggedInNav"
          component={LoggedInNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login Screen" }}
        />
        <Stack.Screen
          name="Update Profile"
          component={UpdateProfile}
          options={{ title: "Update Profile" }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{ title: "Sign Up Screen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
