import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Button } from 'react-native';
import { useFormik } from 'formik';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import CustomAlert from '../Components/Alert';

const LoginScreen = ({ navigation }) =>
{
  const isFocused = useIsFocused();

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const handleShowAlert = (message) =>
  {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () =>
  {
    setShowAlert(false);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values =>
    {
      const errors = {};

      if (!values.email)
      {
        errors.email = 'Must enter email';
      } else if (!EmailValidator.validate(values.email))
      {
        errors.email = 'Must enter valid email';
      }

      if (!values.password)
      {
        errors.password = 'Must enter password';
      }

      return errors;
    },
    onSubmit: async values =>
    {
      try
      {
        const response = await fetch('http://localhost:3333/api/1.0.0/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (response.status === 200)
        {
          const responseJson = await response.json();
          await AsyncStorage.setItem('whatsthat_session_token', responseJson.token);
          await AsyncStorage.setItem('user_id', responseJson.id);

          navigation.navigate('PrivateRoutes')
          handleShowAlert(
            `Successfully logged in`,
          );
        } else if (response.status === 400)
        {
          throw new Error('Invalid email or password');
        } else
        {
          throw new Error('Something went wrong');
        }
      } catch (error)
      {
        handleShowAlert(

          error.message,

        );
      }
    }
  });

  useEffect(() =>
  {
    checkToken();
  }, [isFocused])
  const checkToken = async () =>
  {
    try
    {
      const token = await AsyncStorage.getItem("whatsthat_session_token");

      if (token)
      {
        navigation.navigate("PrivateRoutes")

      } else
      {
      }
    } catch (error)
    {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <CustomAlert
        visible={showAlert}
        message={alertMessage}
        onClose={handleCloseAlert}
      />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          onChangeText={formik.handleChange('email')}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && <Text style={styles.errorText}>{formik.errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          onChangeText={formik.handleChange('password')}
          value={formik.values.password}
          secureTextEntry
        />
        {formik.touched.password && formik.errors.password && <Text style={styles.errorText}>{formik.errors.password}</Text>}

        <TouchableOpacity onPress={formik.handleSubmit}>
          <View style={{ ...styles.button, width: 300 }}>
            <Text style={styles.buttonText}>Login</Text>
          </View>
        </TouchableOpacity>

        <Button
          title="Need An Account?"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  formContainer: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 300,
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginBottom: 30,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LoginScreen;
