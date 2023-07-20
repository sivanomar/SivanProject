import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateChatScreen = ({ navigation }) => {
  const [chatName, setChatName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddChat = async () => {
    if (chatName.trim() === '') {
      Alert.alert('Error', 'Chat name cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      // Call the API to add a new chat
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          name: chatName,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Chat added successfully');
        navigation.navigate('Chats');
      } else {
        throw new Error('Failed to add chat');
      }
    } catch (error) {
      console.error('Error', error.message);
      Alert.alert('Error', 'Failed to add chat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={isLoading} size="large" color="#2196F3" style={styles.activityIndicator} />
      <TextInput
        style={styles.input}
        placeholder="Chat Name"
        onChangeText={(text) => setChatName(text)}
        value={chatName}
        editable={!isLoading} // Disable input while the API call is in progress
      />
      {!isLoading && <Button title="Add a Chat" onPress={handleAddChat} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  input: {
    width: 300,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: '50%',
  },
});

export default CreateChatScreen;
