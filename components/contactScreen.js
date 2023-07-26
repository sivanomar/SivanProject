import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [searchText,] = useState('');
  const [filter,] = useState('all');
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() =>
  {
    fetchData(true, searchText, filter);
  }, [isFocused]);

  const fetchData = async (isFilter, searchText, filter) =>
  {
    try
    {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/contacts`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200)
      {
        const searchData = await response.json();
        setData(() => [...searchData]);
      } else
      {
        throw new Error('Something went wrong');
      }
    } catch (error)
    {
      Alert.alert('Error', error.message, [
        {
          text: 'OK',
        },
      ]);
    } finally
    {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () =>
  {
    console.log('Loading more');
    // setOffset(prevOffset => prevOffset + 1);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text>{item.first_name} {item.last_name}</Text>
      <Text>{item.email}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{ ...styles.addButton, backgroundColor: "red" }}
          onPress={() => deleteUser(item.user_id)}
        >
          <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => blockUser(item.user_id)}
        >
          <Text style={styles.buttonText}>Block User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const blockUser = async (userId) =>
  {
    try
    {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200)
      {
        fetchData(true, searchText, filter);

        Alert.alert('Success', 'User blocked successfully');
      } else
      {
        throw new Error('Something went wrong');
      }
    } catch (error)
    {
      Alert.alert('Error', error.message, [
        {
          text: 'OK',
        },
      ]);
    } finally
    {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) =>
  {
    try
    {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('whatsthat_session_token');

      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.status === 200)
      {
        fetchData(true, searchText, filter);

        Alert.alert('Success', 'User deleted successfully');
        // Remove the deleted user from the data array
        setData(prevData => prevData.filter(item => item.user_id !== userId));
      } else
      {
        throw new Error('Something went wrong');
      }
    } catch (error)
    {
      Alert.alert('Error', error.message, [
        {
          text: 'OK',
        },
      ]);
    } finally
    {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ ...styles.addButton, marginVertical: 10 }}
        onPress={() => { navigation.navigate('Blocked Users') }}
      >
        <Text style={styles.buttonText}>Show Blocked User</Text>
      </TouchableOpacity>
      {
        data && data.length === 0 &&
        <View style={styles.emptyContainer}>
          <AntDesign name="frowno" size={48} color="gray" />
          <Text style={styles.emptyText}>No Contact Found</Text>
        </View>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.activityIndicator} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.user_id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.flatListContent}
        />
      )}

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
  searchInput: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterOption: {
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    color: 'black',
  },
  selectedOption: {
    color: 'white',
    backgroundColor: 'blue',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
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
});

export default SearchScreen;
