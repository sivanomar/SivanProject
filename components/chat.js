import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Modal, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const ChatList = ({ navigation }) =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedChatName, setEditedChatName] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);

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

  const handleEditChatNames = (chatId, chatName) =>
  {
    setIsModalVisible(true);
    setCurrentChatId(chatId);
    setEditedChatName(chatName);
  };

  const handleUpdateChat = async () =>
  {
    if (editedChatName.trim() === '')
    {
      return;
    }

    try
    {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${currentChatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          name: editedChatName,
        }),
      });

      if (response.ok)
      {
        setIsModalVisible(false);
        fetchChats();
      } else
      {
        throw new Error('Failed to update chat name');
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
      <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Creator Name: </Text>
        {item.creator.first_name}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Last Message:</Text> {item.last_message.message ?? ''}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={{ ...styles.deleteButton, backgroundColor: "green" }} onPress={() => handleEditChatNames(item.chat_id, item.name)}>
          <Text style={styles.buttonText}>Edit Chat Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() =>
        {
          navigation.navigate('Send Message', { chatId: item.chat_id });
        }}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() =>
        {
          navigation.navigate('Add User In Chat', { chatId: item.chat_id });
        }}>
          <Text style={styles.buttonText}>Add Users</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('Create Chat')}>
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

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Chat Name"
              onChangeText={(text) => setEditedChatName(text)}
              value={editedChatName}
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateChat}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Update</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#2196F3',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ChatList;
