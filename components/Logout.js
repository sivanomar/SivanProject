import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native-web";

const Logout = (props) => {
  const logout = async () => {
    console.log("Logout");
    const { navigation } = props;
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    if (!token) throw new Error("No session token found");
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "POST",
      headers: { "X-Authorization": token },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          navigation.navigate("Login");
        } else if (response.status === 401) {
          console.log("Unauthorized");
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          navigation.navigate("Login");
        } else throw new Error("Something went wrong");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{ paddingLeft: 10, paddingRight: 10, paddinghorizontal: 20 }}
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <View style={Styles.btn}>
          <Text style={Styles.btnText}>My Profile</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ paddingLeft: 10, paddingRight: 10, paddinghorizontal: 20 }}
        onPress={() => logout()}
      >
        <View style={Styles.btn}>
          <Text style={Styles.btnText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default Logout;
const Styles = StyleSheet.create({
  btn: {
    backgroundColor: "darkblue",
    margin: 15,
    width: "82vw",
    borderRadius: 25,
  },
  btnText: {
    textAlign: "center",
    padding: 10,
    color: "white",
  },
});
