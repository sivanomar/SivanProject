import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as EmailValidator from 'email-validator';


export default class LoginScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
            successMessage: "",
            submitted: false
        }


        this._onPressButton = this._onPressButton.bind(this)
    }

    _onPressButton(){
        this.setState({submitted: true, emailError: "", passwordError: "", successMessage: ""})
    
        if(!(this.state.email && this.state.password)){
            this.setState({emailError: "Must enter email", passwordError: "Must enter password"})
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
    


        const { email, password } = this.state;
        fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            this.setState({successMessage: `Successfully logged in with email: ${email}`})
            console.log("Validated and ready to send to the API");
        })
        .catch(error => {
            console.error(error);
        });
    }
    

    render(){

const navigation = this.props.navigation;

        return (
            <View style={styles.container}>

                <View style={styles.formContainer}>
                    <View style={styles.emailLabel}>
                        <Text>Email:</Text> 
                        </View>
                        <View style={styles.email}>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter email"
                            onChangeText={email => this.setState({email})}
                            defaultValue={this.state.email}
                        />

                        <>
                            {this.state.submitted && !this.state.email &&
                                <Text style={styles.error}>*Email is required</Text>
                            }
                            {this.state.emailError !== "" &&
                                <Text style={styles.error}>{this.state.emailError}</Text>
                            }
                        </>
                    </View>
                    <View style={styles.passwordLabel}>
                        <Text>Password:</Text> 
                        </View>
                    <View style={styles.password}>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter password"
                            onChangeText={password => this.setState({password})}
                            defaultValue={this.state.password}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password is required</Text>
                            }
                            {this.state.passwordError !== "" &&
                                <Text style={styles.error}>{this.state.passwordError}</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.loginbtn}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.successMessage !== "" &&
                            <Text style={styles.success}>{this.state.successMessage}</Text>
                        }
                    </>
                   
                
                 <Button
           title="Need an account?"
            onPress={() => this.props.navigation.navigate('SignUp')}
 />


                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "lightblue",
    },
    formContainer: {
        width: "75%",
      alignItems: "center",
      justifyContent: "center",
    },

    emailLabel: {

    },
    email: {
      marginBottom: 10,
      width: "100%",
      backgroundColor:"white",

    },

    passwordLabel: {

    },
    password: {
      marginBottom: 20,
      width: "100%",
      backgroundColor:"white",
    },
    button: {
      width: "100%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2196F3",
      marginBottom: 30,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
    error: {
      color: "red",
      fontWeight: "bold",
      marginBottom: 10,
    },
    success: {
      color: "green",
      fontWeight: "bold",
      marginBottom: 10,
    },
    signUp: {
      marginTop: 20,
      color: "#2196F3",
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
    loginbtn: {
width: "80%"
    },
  });
  