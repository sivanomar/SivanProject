import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const token = await AsyncStorage.getItem('whatsthat_session_token');
        const user_id = await AsyncStorage.getItem('user_id');

        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
        });

        if (response.status === 200) {
          const userData = await response.json();
          console.log("userData",userData)
          setUserData({...userData});
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', error.message, [
          {
            text: 'OK',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be at least 8 characters long.'
        ),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const token = await AsyncStorage.getItem('whatsthat_session_token');
        const user_id = await AsyncStorage.getItem('user_id');

        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
          body: JSON.stringify(values),
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Profile updated successfully', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else if (response.status === 400) {
          throw new Error('Invalid data');
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', error.message, [
          {
            text: 'OK',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
  });
  useEffect(() => {
    if (userData) {
      formik.setValues({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: '',
      });
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          onChangeText={formik.handleChange('first_name')}
          value={formik.values.first_name}
        />
        {formik.touched.first_name && formik.errors.first_name && (
          <Text style={styles.errorText}>{formik.errors.first_name}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          onChangeText={formik.handleChange('last_name')}
          value={formik.values.last_name}
        />
        {formik.touched.last_name && formik.errors.last_name && (
          <Text style={styles.errorText}>{formik.errors.last_name}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          onChangeText={formik.handleChange('email')}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          onChangeText={formik.handleChange('password')}
          value={formik.values.password}
          secureTextEntry
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.activityIndicator} />
        ) : (
          <TouchableOpacity onPress={formik.handleSubmit}>
            <View style={{ ...styles.button, width: 300 }}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </View>
          </TouchableOpacity>
        )}
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
  activityIndicator: {
    marginVertical: 20,
  },
});

export default UpdateProfileScreen;
