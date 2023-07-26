import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import axios from 'axios';
const UpdateProfileScreen = ({ navigation }) =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [profilePicture, setProfilePicture] = useState(null);
  useEffect(() =>
  {
    const fetchUserData = async () =>
    {
      try
      {
        setIsLoading(true);

        const token = await AsyncStorage.getItem('whatsthat_session_token');
        const user_id = await AsyncStorage.getItem('user_id');

        const [userResponse, photoResponse] = await Promise.all([
          axios.get(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Authorization': token,
            },
          }),
          axios.get(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Authorization': token,
            },
            responseType: 'blob',
          }),
        ]);

        if (userResponse.status === 200)
        {
          const userData = userResponse.data;
          setUserData({ ...userData });
        } else
        {
          throw new Error('Something went wrong');
        }

        if (photoResponse.status === 200)
        {
          console.log("photoResponse", photoResponse);

          const blob = await photoResponse.data
          console.log("photoResponse", blob);

          setProfilePicture(URL.createObjectURL(blob));
        } else
        {
          // Handle case when the user doesn't have a profile picture
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


    fetchUserData();
  }, []);

  useEffect(() =>
  {
    (async () =>
    {
      if (Constants.platform.ios)
      {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted')
        {
          Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to upload a profile picture.');
        }
      }
    })();
  }, []);

  const selectProfilePicture = async () =>
  {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result)
    if (!result.cancelled)
    {
      setProfilePicture(result.uri);
      onSubmit(result.uri)
    }
  };

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
    onSubmit: async (values) =>
    {
      try
      {
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

        if (response.status === 200)
        {
          Alert.alert('Success', 'Profile updated successfully', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else if (response.status === 400)
        {
          throw new Error('Invalid data');
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
    },
  });
  useEffect(() =>
  {
    if (userData)
    {
      formik.setValues({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: '',
      });
    }
  }, [userData]);

  const onSubmit = async (values) =>
  {
    try
    {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const user_id = await AsyncStorage.getItem('user_id');

      const formData = new FormData();
      if (values)
      {
        console.log("values", values.replace("data:", "").split(";")[0])
        console.log("values", {
          uri: values,
          name: "photo",
          type: values.replace("data:", "").split(";")[0],
        })


        formData.append('photo', {
          uri: values,
          name: "photo",
          type: values.replace("data:", "").split(";")[0],
        });
      }

      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          "Content-Type": values.replace("data:", "").split(";")[0]
        },
        body: formData,
      });

      // Rest of the code remains the same
    } catch (e) { }
  }
  return (
    <View style={styles.container}>

      <View style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image style={styles.profilePicture} source={{ uri: profilePicture }} />
        ) : (
          <Text style={styles.profilePicturePlaceholder}>No profile picture</Text>
        )}
        <TouchableOpacity onPress={selectProfilePicture}>
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>


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
  profilePictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profilePicturePlaceholder: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  changePictureText: {
    fontSize: 16,
    color: '#2196F3',
    marginTop: 10,
  },
});

export default UpdateProfileScreen;
