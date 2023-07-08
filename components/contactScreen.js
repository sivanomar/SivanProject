import React, { Component } from "react";
import {
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

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      searchString: "",
      isLoading: true,
      errorstate: "",
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getContacts();
    });
  }

  async getContacts() {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      if (!token) {
        throw new Error("No session token found");
      }
  
      const response = await fetch("http://localhost:3333/api/1.0.0/contacts", {
        method: "GET",
        headers: {
          "X-Authorization": token,
        },
      });
  
      if (response.status === 200) {
        const data = await response.json();
        this.setState({ contacts: data });
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else if (response.status === 500) {
        throw new Error("Server error");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async searchContact() {
    const { searchString, offset } = this.state;
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      if (!token) {
        throw new Error("No session token found");
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
  
      if (response.status === 200) {
        const newData = await response.json();
        const currentUser = await AsyncStorage.getItem("whatsthat_user_id");
        const filteredData = newData.filter(
          (obj) => parseInt(obj.user_id, 10) !== parseInt(currentUser, 10)
        );
        this.setState({ contacts: filteredData });
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else if (response.status === 500) {
        throw new Error("Server error");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }
  

  render() {
    const navigation = this.props.navigation;
    const { searchString, contacts } = this.state;
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Contacts"
            onChangeText={(value) => this.setState({ searchString: value })}
            value={searchString}
          />
          <TouchableOpacity onPress={() => this.searchContact()}>
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf: "center",
  },
  contact: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "darkblue",
    paddingLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "darkblue",
  },
  email: {
    fontSize: 14,
    color: "darkblue",
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  formContainer: {
    flex: 1,
  },
  optWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  optBtn: {
    backgroundColor: "darkblue",
    margin: 5,
    width: "45vw",
  },
  optBtnText: {
    textAlign: "center",
    padding: 10,
    color: "white",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
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
    backgroundColor: "lightblue",
    margin: 5,
    width: "20vw",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    padding: 10,
    color: "white",
  },
  error: {
    color: "red",
    textAlign: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
});
