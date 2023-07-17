import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const ChatList = ({ navigation }) =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() =>
  {
    fetchChats();
  }, []);

  const fetchChats = async () =>
  {
    try
    {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200)
      {
        const chatData = await response.json();
        setChats(chatData);
      } else
      {
        throw new Error('Something went wrong');
      }
    } catch (error)
    {
      console.error('Error', error.message);
    } finally
    {
      setIsLoading(false);
    }
  };



  const renderChat = ({ item }) => (
    <View style={styles.card}>
      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Creator Name: </Text>{item.creator.first_name}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Last Message:</Text> {item.last_message.message ?? ""}</Text>

      <TouchableOpacity style={styles.deleteButton} onPress={() => { }}>
        <Text style={styles.buttonText}>Edit Chat Names</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateChat')}
      >
        <Text style={styles.buttonText}>Create Chat</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.activityIndicator} />
      ) : chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.chat_id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <AntDesign name="frowno" size={48} color="gray" />
          <Text style={styles.emptyText}>No Chats Found</Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  createButton: {
    marginVertical: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: "#2196F3",

  },
  activityIndicator: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
};

export default ChatList;
