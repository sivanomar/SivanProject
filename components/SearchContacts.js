import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () =>
{
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('all');
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);


    useEffect(() =>
    {
        fetchData(true, searchText, filter);
    }, []);
    const fetchData = async (isFilter, searchText, filter) =>
    {
        try
        {
            setIsLoading(true);

            const token = await AsyncStorage.getItem('whatsthat_session_token');

            const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${searchText}&search_in=${filter}&limit=20&offset=${offset}`, {
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
                if (isFilter)
                    setData(prevData => [...prevData, ...searchData]);
                else
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
            <Text>{item.given_name} {item.family_name}</Text>
            <Text>{item.email}</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => addUserContact(item.user_id)}
            >
                <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
        </View>
    );

    const addUserContact = async (userId) =>
    {
        try
        {
            setIsLoading(true);

            const token = await AsyncStorage.getItem('whatsthat_session_token');

            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.status === 200)
            {
                Alert.alert('Success', 'User added successfully');
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
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                onChangeText={text =>
                {
                    setSearchText(text)
                    fetchData(false, text, filter);
                }}
                value={searchText}
            />
            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterOption} onPress={() =>
                {
                    setFilter('all')
                    fetchData(false, searchText, 'all');

                }}>
                    <Text style={filter === 'all' ? styles.selectedOption : styles.option}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() =>
                {
                    setFilter('contacts')
                    fetchData(false, searchText, 'contacts');

                }}>
                    <Text style={filter === 'contacts' ? styles.selectedOption : styles.option}>Contacts</Text>
                </TouchableOpacity>
            </View>
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
});

export default SearchScreen;
