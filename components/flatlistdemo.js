import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default class FlatListDemo extends Component{

    constructor(props){
        super(props);

        this.state = {
            conversation: [
                {id: 1, user_id: 1, name: "Ash", message: "Tell me why?"},
                {id: 2, user_id: 2, name: "Ronan", message: "Ain't nothing by a heartache"},
                {id: 3, user_id: 1, name: "Ash", message: "Tell me why?"},
                {id: 4, user_id: 2, name: "Ronan", message: "Ain't nothing by a mistake"},
                {id: 5, user_id: 1, name: "Ash", message: "Tell me why?"},
                {id: 6, user_id: 2, name: "Ronan", message: "I never want to hear you say"},
                {id: 7, user_id: 1, name: "Ash", message: "I want it that way"},
                {id: 8, user_id: 2, name: "Ronan", message: "Am I your fire? Your one desire?"},
                {id: 9, user_id: 1, name: "Ash", message: "No, don't call here no more creep!"},
            ],
            messageText: ''
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <FlatList 
                        data={this.state.conversation}
                        renderItem={({item}) => (
                            <View style={[styles.message, item.user_id === 1 ? styles.other : styles.from_me ]}>
                                <Text style={styles.author}>{item.name}</Text>
                                <Text style={styles.content}>{item.message}</Text>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Type a message" 
                        onChangeText={(text) => this.setState({messageText: text})}
                        value={this.state.messageText}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={this.sendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    sendMessage = () => {
        if (this.state.messageText.trim() === '') {
            return;
        }
        const newMessage = {
            id: Math.random().toString(36).substring(7),
            user_id: 1,
            name: "Ash",
            message: this.state.messageText
        };
        this.setState(prevState => ({
            conversation: [...prevState.conversation, newMessage],
            messageText: ''
        }));
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    wrapper: {
      flex: 1
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
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#cccccc',
      padding: 10,
      height: 60
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: '#333333',
      borderRadius: 20,
      padding: 10,
      backgroundColor: '#f2f2f2'
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: 'steelblue',
      borderRadius: 20,
      padding: 10
    },
    sendButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  });