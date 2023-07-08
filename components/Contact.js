import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
const Contact = (props) => {
  const { firstname, surname } = props;
  return (
    <View style={Styles.contactBorder}>
      <Text style={Styles.name}>
        {firstname} {surname}
      </Text>
    </View>
  );
};
export default Contact
const Styles = StyleSheet.create({
  contactBorder: {
    borderLeftWidth: "thick",
    borderRightWidth: "thick",
    borderTopWidth: "thick",
    borderBottomWidth: "thick",
    borderRadius: 50,
    padding: 10,
    margin: 5,
    backgroundColor: "darkblue",
    justifyContent: "stretch",
  },
  name: {
    fontSize: 20,
    color: "white",
  },
});
