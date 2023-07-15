import React, { useState, useEffect } from "react";
import
  {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
  } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Contact from "./Contact";

const ContactScreen = () =>
{
  const [contacts, setContacts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState("");

  useEffect(() =>
  {
    getContacts();
  }, []);

  const getContacts = async () =>
  {
    try
    {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      if (!token)
      {
        // throw new Error("No session token found");
      }
return
      const response = await fetch("http://localhost:3333/api/1.0.0/contacts", {
        method: "GET",
        headers: {
          "X-Authorization": token,
        },
      });

      if (response.status === 200)
      {
        const data = await response.json();
        setContacts(data);
      } else if (response.status === 401)
      {
        throw new Error("Unauthorized");
      } else if (response.status === 500)
      {
        // throw new Error("Server error");
      } else
      {
        // throw new Error("Something went wrong");
      }
    } catch (error)
    {
      console.log(error);
    }
  };

  const searchContact = async () =>
  {
    try
    {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      if (!token)
      {
        // throw new Error("No session token found");
      }

      const response = await fetch(
        `http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=contacts&limit=20&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "X-Authorization": token,
          },
        }
      );

      if (response.status === 200)
      {
        const newData = await response.json();
        const currentUser = await AsyncStorage.getItem("whatsthat_user_id");
        const filteredData = newData.filter(
          (obj) => parseInt(obj.user_id, 10) !== parseInt(currentUser, 10)
        );
        setContacts(filteredData);
      } else if (response.status === 401)
      {
        throw new Error("Unauthorized");
      } else if (response.status === 500)
      {
        throw new Error("Server error");
      } else
      {
        throw new Error("Something went wrong");
      }
    } catch (error)
    {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Contacts"
          onChangeText={(value) => setSearchString(value)}
          value={searchString}
        />
        <TouchableOpacity onPress={searchContact}>
          <View style={styles.searchBtn}>
            <Text style={styles.btnText}>Search</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={contacts}
        renderItem={({ item: data }) => (
          <TouchableOpacity>
            <Contact
              firstname={data.first_name || data.given_name}
              surname={data.last_name || data.family_name}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(data) => data.user_id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    paddingHorizontal: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    color:"white",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  searchInput: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 10,
    margin: 5,
    width: "75vw",
  },
  searchBtn: {
    backgroundColor: '#2196F3',
    margin: 5,
    width: "20vw",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    padding: 10,
    color: "white",
  },
});

export default ContactScreen;