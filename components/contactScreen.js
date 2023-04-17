import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default class ContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const token = navigation.getParam('X-Authorisation');

    fetch('http://localhost:3333/api/1.0.0/contacts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ contacts: data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.contacts}
          keyExtractor={item => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.contact}>
              <Text style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  contact: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 14,
    color: '#444444'
  }
});
