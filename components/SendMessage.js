import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route }) =>
{
  const [conversation, setConversation] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user_id, setuser_id] = useState(null);
  const [message_id, setmessage_id] = useState(null)

  const chatId = route?.params?.chatId ?? null;

  useEffect(async () =>
  {
    fetchChatDetails();
    const user_id = await AsyncStorage.getItem('user_id');
    setuser_id(user_id)
  }, []);

  const fetchChatDetails = async () =>
  {
    try
    {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}?limit=29&offset=0`, {
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
        setConversation(chatData.messages);
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

  const sendMessage = async () =>
  {
    try
    {
      if (message_id)
      {
        updateMessage(message_id, messageText)
        return

      }
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,

        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      if (response.status === 200)
      {
        const newMessage = {
          message_id: conversation.length + 1, // Generate a unique ID for the new message
          timestamp: Date.now(),
          message: messageText,
          author: {
            user_id: 14, // Replace with the actual user_id of the sender
            first_name: "Ashley",
            last_name: "Williams",
            email: "ashley.williams@mmu.ac.uk"
          },
        };

        fetchChatDetails();

        setMessageText('');
        console.log('Message sent successfully');
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

  const deleteMessage = async (messageId) =>
  {
    try
    {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200)
      {
        setConversation(prevConversation => prevConversation.filter(message => message.message_id !== messageId));
        console.log('Message deleted successfully');
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

  const updateMessage = async (messageId, newMessage) =>
  {
    try
    {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,

        },
        body: JSON.stringify({
          message: newMessage,
        }),
      });

      if (response.status === 200)
      {
        setConversation(prevConversation => prevConversation.map(message =>
          message.message_id === messageId ? { ...message, message: newMessage } : message
        ));
        console.log('Message updated successfully');
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
    setmessage_id(null)
    setMessageText("")
  };

  const renderMessage = ({ item }) =>
  {
    const isOwnMessage = item.author.user_id == user_id; // Replace with the actual user_id of the logged-in user
    console.log("isOwnMessage", isOwnMessage)
    console.log("isOwnMessage 2", user_id)

    return (
      <View style={[styles.message, isOwnMessage ? styles.from_me : styles.from_other]}>
        <Text style={styles.author}>{item.author.first_name} {item.author.last_name}</Text>
        <Text style={styles.content}>{item.message}</Text>
        {isOwnMessage && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMessage(item.message_id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
        {isOwnMessage && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
            {
              setmessage_id(item.message_id)
              setMessageText(item.message)
            }}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.activityIndicator} />
        ) : (
          <FlatList
            data={conversation}
            renderItem={renderMessage}
            keyExtractor={item => item.message_id.toString()}
          />
        )}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          onChangeText={text => setMessageText(text)}
          value={messageText}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!messageText || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  wrapper: {
    flex: 1,
  },
  message: {
    borderRadius: 15,
    padding: 5,
    margin: 5,
    width: '60%',
  },
  author: {
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    fontStyle: 'italic',
    color: '#ffffff',
  },
  from_me: {
    alignSelf: 'flex-end',
    backgroundColor: 'skyblue',
  },
  from_other: {
    backgroundColor: 'limegreen',
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  updateButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    padding: 10,
  },
  input: {
    width: '95%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  sendButton: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginBottom: 10,
    marginTop: 10,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Chat;