import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator';

export default class SignUpScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            firstNameError: "",
            lastNameError: "",
            emailError: "",
            passwordError: "",
            confirmPasswordError: "",
            successMessage: "",
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
    }

    _onPressButton(){
        this.setState({submitted: true, firstNameError: "", lastNameError: "", emailError: "", passwordError: "", confirmPasswordError: "", successMessage: ""})
      
        if(!(this.state.firstName && this.state.lastName && this.state.email && this.state.password && this.state.confirmPassword)){
            this.setState({firstNameError: "Must enter first name", lastNameError: "Must enter last name", emailError: "Must enter email", passwordError: "Must enter password", confirmPasswordError: "Must enter confirm password"})
            return;
        }
      
        if(!EmailValidator.validate(this.state.email)){
            this.setState({emailError: "Must enter valid email"})
            return;
        }
      
        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({passwordError: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }
        
        if(this.state.password !== this.state.confirmPassword){
            this.setState({confirmPasswordError: "Passwords do not match"})
            return;
        }
      
        const { firstName, lastName, email, password } = this.state;
    
        fetch("http://localhost:3333/api/1.0.0/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password
          })
        })
        .then(response => {
          if (response.ok) {
            this.setState({successMessage: `Successfully signed up with name: ${firstName} ${lastName}, email: ${email}`})
            console.log("Validated and sent to the API");
            this.props.navigation.navigate('Login');
          } else {
            throw new Error("Failed to send data to API");
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    

    render(){
        return (
            <View style = {styles.container}>
                <TextInput
                    style = {styles.input}
                    placeholder = "First Name"
                    onChangeText = {(firstName) => this.setState({firstName})}
                    value = {this.state.firstName}
                />
                <Text style = {styles.errorText}>{this.state.firstNameError}</Text>
    
                <TextInput
                    style = {styles.input}
                    placeholder = "Last Name"
                    onChangeText = {(lastName) => this.setState({lastName})}
                    value = {this.state.lastName}
                />
                <Text style = {styles.errorText}>{this.state.lastNameError}</Text>
    
                <TextInput
                    style = {styles.input}
                    placeholder = "Email"
                    onChangeText = {(email) => this.setState({email})}
                    value = {this.state.email}
                />
                <Text style = {styles.errorText}>{this.state.emailError}</Text>
    
                <TextInput
                    style = {styles.input}
                    placeholder = "Password"
                    secureTextEntry={true}
                    onChangeText = {(password) => this.setState({password})}
                    value = {this.state.password}
                />
                <Text style = {styles.errorText}>{this.state.passwordError}</Text>
    
                <TextInput
                    style = {styles.input}
                    placeholder = "Confirm Password"
                    secureTextEntry={true}
                    onChangeText = {(confirmPassword) => this.setState({confirmPassword})}
                    value = {this.state.confirmPassword}
                />
                <Text style = {styles.errorText}>{this.state.confirmPasswordError}</Text>
    
                <TouchableOpacity style = {styles.button} onPress = {this._onPressButton}>
                    <Text style = {styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
    
                <Text style = {styles.successText}>{this.state.successMessage}</Text>
    
            </View >
        );
    
    }
    }
    
    const styles = StyleSheet.create ( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red'
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    successText: {
        color: 'green',
        fontWeight: 'bold',
        marginTop: 10
    }
    
    })
    