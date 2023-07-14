import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as EmailValidator from 'email-validator';

const SignUpScreen = () =>
{
    const [successMessage, setSuccessMessage] = useState("");

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validate: values =>
        {
            const errors = {};

            if (!values.firstName)
            {
                errors.firstName = "Must enter first name";
            }

            if (!values.lastName)
            {
                errors.lastName = "Must enter last name";
            }

            if (!values.email)
            {
                errors.email = "Must enter email";
            } else if (!EmailValidator.validate(values.email))
            {
                errors.email = "Must enter valid email";
            }

            if (!values.password)
            {
                errors.password = "Must enter password";
            } else
            {
                const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (!PASSWORD_REGEX.test(values.password))
                {
                    errors.password =
                        "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)";
                }
            }

            if (!values.confirmPassword)
            {
                errors.confirmPassword = "Must enter confirm password";
            } else if (values.confirmPassword !== values.password)
            {
                errors.confirmPassword = "Passwords do not match";
            }

            return errors;
        },
        onSubmit: values =>
        {
            setSuccessMessage("");

            fetch("http://localhost:3333/api/1.0.0/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: values.firstName,
                    last_name: values.lastName,
                    email: values.email,
                    password: values.password
                })
            })
                .then((response, error) =>
                {
                    console.log(error)
                    console.log(response)


                    if (response.ok)
                    {
                        navigation.navigate("Login");
                        Alert.alert(
                            "Success",
                            `Successfully signed up with name: ${values.firstName} ${values.lastName}, email: ${values.email}`,
                            [
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate("Login")
                                }
                            ]
                        );
                        // Handle navigation here
                    } else
                    {
                        Alert.alert(
                            "Failed to login",
                            [
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate("Login")
                                }
                            ]
                        );
                        throw new Error("Failed to send data to API");
                    }
                })
                .catch(error =>
                {
                    console.error(error);
                });
        }
    });

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={formik.handleChange("firstName")}
                value={formik.values.firstName}
            />
            <Text style={styles.errorText}>{formik.errors.firstName}</Text>

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={formik.handleChange("lastName")}
                value={formik.values.lastName}
            />
            <Text style={styles.errorText}>{formik.errors.lastName}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={formik.handleChange("email")}
                value={formik.values.email}
            />
            <Text style={styles.errorText}>{formik.errors.email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={formik.handleChange("password")}
                value={formik.values.password}
            />
            <Text style={styles.errorText}>{formik.errors.password}</Text>

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={formik.handleChange("confirmPassword")}
                value={formik.values.confirmPassword}
            />
            <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>

            <Button
                title="Sign Up"
                onPress={formik.handleSubmit}
            />

            <Text style={styles.successText}>{successMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue",
    },
    input: {
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white"
    },
    errorText: {
        color: "red",
        textAlign: "center"
    },
    button: {
        width: "100%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2196F3",
        marginBottom: 30,
        marginTop: 30,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    successText: {
        color: "green",
        fontWeight: "bold",
        marginTop: 10
    }
});

export default SignUpScreen;
