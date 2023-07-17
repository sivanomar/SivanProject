import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const BlockedUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200) {
        const blockedData = await response.json();
        setBlockedUsers(blockedData);
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.error('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200) {
        fetchBlockedUsers();
        console.log('User unblocked successfully');
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.error('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBlockedUser = ({ item }) => (
    <View style={styles.card}>
      <Text>{item.first_name} {item.last_name}</Text>
      <Text>{item.email}</Text>
      <TouchableOpacity style={styles.unblockButton} onPress={() => unblockUser(item.user_id)}>
        <Text style={styles.buttonText}>Unblock User</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.activityIndicator} />
      ) : blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          renderItem={renderBlockedUser}
          keyExtractor={(item) => item.user_id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <AntDesign name="frowno" size={48} color="gray" />
          <Text style={styles.emptyText}>No Blocked Users Found</Text>
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
  card: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  unblockButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
};

export default BlockedUsers;
