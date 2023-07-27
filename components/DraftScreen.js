
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DraftScreen = ({ route }) =>
{
    const [messageText, setMessageText] = useState('');
    const [isUpdate, setIsUpdate] = useState(null);
    const [drafts, setDrafts] = useState([]);
    const chatId = route?.params?.chatId ?? null;

    useEffect(() =>
    {
        fetchDrafts();

    }, [])

    const sendMessage = async (messageText) =>
    {
        try
        {
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
        }
    };
    const fetchDrafts = async () =>
    {
        try
        {
            const draftsData = await AsyncStorage.getItem('drafts');
            if (draftsData)
            {
                const parsedDrafts = JSON.parse(draftsData);
                setDrafts(parsedDrafts);
            }
        } catch (error)
        {
            console.error('Error', error.message);
        }
    };
    const saveDraft = async () =>
    {
        try
        {
            const newDraft = {
                chatId: chatId + Math.random() + Math.random(),
                messageText: messageText,
            };
            const updatedDrafts = [...drafts, newDraft];
            await AsyncStorage.setItem('drafts', JSON.stringify(updatedDrafts));
            setDrafts([...updatedDrafts]);
            console.log('Draft saved successfully');
            setMessageText("")
        } catch (error)
        {
            console.error('Error', error.message);
        }
    };
    const updateDraft = async () =>
    {
        try
        {
            const updatedDrafts = drafts.map(draft =>
            {
                if (draft.chatId === isUpdate.chatId)
                {
                    draft.messageText = messageText;
                }
                return draft;
            });
            await AsyncStorage.setItem('drafts', JSON.stringify(updatedDrafts));
            setDrafts(updatedDrafts);
            setIsUpdate(null);
            setMessageText('');
            console.log('Draft updated successfully');
        } catch (error)
        {
            console.error('Error', error.message);
        }
    };
    const deleteDraft = async (draftChatId) =>
    {
        try
        {
            const updatedDrafts = drafts.filter((draft) => draft.chatId !== draftChatId);
            await AsyncStorage.setItem('drafts', JSON.stringify(updatedDrafts));
            setDrafts(updatedDrafts);
            console.log('Draft deleted successfully');
        } catch (error)
        {
            console.error('Error', error.message);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.draftInputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a draft"
                    onChangeText={text => setMessageText(text)}
                    value={messageText}
                />
                <TouchableOpacity style={styles.saveButton} onPress={() =>
                    isUpdate ?
                        updateDraft() :
                        saveDraft()} disabled={!messageText}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.draftList}>
                {drafts && drafts.length === 0 ? (
                    <Text style={styles.noDraftsText}>No drafts available</Text>
                ) : (
                    <FlatList
                        data={drafts && drafts.length > 0 ? drafts : []}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.draftItem}

                            >
                                <Text style={styles.draftText}>{item.messageText}</Text>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                    <TouchableOpacity
                                        style={styles.sendButton}

                                        onPress={() =>
                                        {
                                            setIsUpdate(item)
                                            setMessageText(item.messageText);
                                        }}
                                    >
                                        <Text style={styles.sendButtonText}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                        {
                                            deleteDraft(item.chatId);
                                        }}
                                        style={styles.sendButton}

                                    >
                                        <Text style={styles.draftButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.sendButton}
                                        onPress={() =>
                                        {
                                            deleteDraft(item.chatId);
                                            sendMessage(item.messageText)
                                        }}
                                    >
                                        <Text style={styles.draftButtonText}>Send</Text>
                                    </TouchableOpacity>
                                </View>

                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
            </View>
        </View>
    );
};
export default DraftScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
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
        width: '32%',
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
    draftButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'lightgray',
        borderRadius: 25,
        padding: 10,
    },
    draftButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    draftInputWrapper: {
        backgroundColor: '#ffffff',
        padding: 10,
    },
    saveButton: {
        width: '100%',
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        marginBottom: 10,
        marginTop: 10,
    },
    draftList: {
        flex: 1,
        padding: 10,
    },
    draftItem: {
        borderRadius: 5,
        backgroundColor: '#e6e6e6',
        padding: 10,
        marginBottom: 10,
    },
    draftText: {
        color: 'black',
    },
    noDraftsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
        alignSelf: 'center',
    },
});
