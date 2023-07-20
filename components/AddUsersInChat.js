import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = (props) =>
{
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [members, setMembers] = useState([]);
    let chatId = props?.route?.params?.chatId ?? null;
    console.log(chatId)
    useEffect(() =>
    {
        fetchData(true);
        fetchMembers();
    }, []);

    const fetchData = async (isFilter) =>
    {
        try
        {
            setIsLoading(true);

            const token = await AsyncStorage.getItem('whatsthat_session_token');

            const response = await fetch(`http://localhost:3333/api/1.0.0/search?limit=20&offset=${offset}`, {
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

    const fetchMembers = async () =>
    {
        try
        {
            const token = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}?limit=1&offset=0`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });
            console.log("members", response)

            if (response.status === 200)
            {
                const { members } = await response.json();
                console.log("members", members)
                setMembers([...members]);
            } else
            {
                throw new Error('Something went wrong');
            }
        } catch (error)
        {
            console.error('Error', error.message);
        }
    };

    const handleLoadMore = () =>
    {
        console.log('Loading more');
        // setOffset(prevOffset => prevOffset + 1);
    };

    const handleAddUser = async (userId) =>
    {
        try
        {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.status === 200)
            {
                fetchData(true);
                fetchMembers();
                console.log('User added successfully');
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

    const handleRemoveUser = async (userId) =>
    {
        try
        {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.status === 200)
            {
                fetchData(true);
                fetchMembers();
                console.log('User removed successfully');
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

    const renderItem = ({ item }) =>
    {
        const isMember = members.find(member => member.user_id === item.user_id);
        console.log("isMember", isMember);
        return (
            <View style={styles.card}>
                <Text>{item.given_name} {item.family_name}</Text>
                <Text>{item.email}</Text>
                {Boolean(isMember) ? (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleRemoveUser(item.user_id)}
                    >
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddUser(item.user_id)}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
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
    flatListContent: {
        paddingBottom: 20,
    },
});

export default SearchScreen;
