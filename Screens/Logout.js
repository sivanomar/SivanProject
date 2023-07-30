import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ navigation }) => {
  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      if (!token) throw new Error('No session token found');

      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: { 'X-Authorization': token },
      });

      if (response.status === 200 || response.status === 401) {
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('whatsthat_user_id');
        navigation.navigate('Login');
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Update Profile')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>My Profile</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightblue',

    alignItems: 'center',
  },
  button: {
    width: 300,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginBottom: 30,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Logout;
