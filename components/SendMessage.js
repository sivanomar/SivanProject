import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Chat = () =>
{
  const [conversation, setConversation] = useState([
    { id: 8, user_id: 2, name: "Ronan", message: "Am I your fire? Your one desire?" },
    { id: 9, user_id: 1, name: "Ash", message: "No, don't call here no more creep!" },
  ]);
  const [messageText, setMessageText] = useState('');

  const sendMessage = () =>
  {
    if (messageText.trim() === '')
    {
      return;
    }
    const newMessage = {
      id: Math.random().toString(36).substring(7),
      user_id: 1,
      name: "Ash",
      message: messageText
    };
    setConversation([...conversation, newMessage]);
    setMessageText('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, { height: "80%" }]}>
        <FlatList
          data={conversation}
          renderItem={({ item }) => (
            <View style={[styles.message, item.user_id === 1 ? styles.other : styles.from_me]}>
              <Text style={styles.author}>{item.name}</Text>
              <Text style={styles.content}>{item.message}</Text>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <View style={[styles.inputWrapper, { height: "20%" }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          onChangeText={text => setMessageText(text)}
          value={messageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
    height: "100vh"
  },
  wrapper: {
    flex: 1,
  },
  message: {
    borderRadius: 15,
    padding: 5,
    margin: 5,
    width: '60%'
  },
  author: {
    fontWeight: 'bold',
    color: '#333'
  },
  content: {
    fontStyle: 'italic',
    color: '#ffffff'
  },
  other: {
    alignSelf: 'flex-end',
    backgroundColor: 'limegreen',
  },
  from_me: {
    backgroundColor: 'skyblue'
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    padding: 10,
  },
  input: {
    width: "95%",
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
  }
});

export default Chat;