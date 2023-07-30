import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../Components/Alert';
import { Camera, CameraType } from 'expo-camera';
import axios from 'axios';

const UpdateProfileScreen = () =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [camera, setCamera] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const handleShowAlert = (message) =>
  {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () =>
  {
    setShowAlert(false);
  };
  const fetchUserData = async () =>
  {
    try
    {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const user_id = await AsyncStorage.getItem('user_id');

      const userResponse = await
        axios.get(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
        });
      if (userResponse.status === 200)
      {
        const userData = userResponse.data;
        setUserData({ ...userData });
      } else
      {
        throw new Error('Something went wrong');
      }

    } catch (error)
    {
      handleShowAlert(error.message);
    } finally
    {
      setIsLoading(false);
    }
  };
  useEffect(() =>
  {
    fetchProfilePicture()
    fetchUserData();
  }, []);
  const takeProfilePicture = async () =>
  {
    setIsCameraModalVisible(true);
  };

  const handleTakePicture = async () =>
  {
    if (camera && permission && permission.granted) 
    {
      const options = { quality: 0.5, base64: true }
      let { uri } = await camera.takePictureAsync(options);
      uploadProfilePicture(uri);
    }
    else
    {
      handleShowAlert("Camera permission denied")
    }
  };
  const uploadProfilePicture = async (uri) =>
  {
    try
    {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const user_id = await AsyncStorage.getItem('user_id');

      const res = await fetch(uri);
      const blob = await res.blob();

      await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
        method: 'POST',
        headers: {
          'X-authorization': token,
          'Content-Type': 'image/png',
        },
        body: blob,
      })
      setIsCameraModalVisible(false);
      fetchProfilePicture()


    } catch (error)
    {
      console.error(error);
      // Handle upload error
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
          handleShowAlert('Profile updated successfully');
        } else if (response.status === 400)
        {
          throw new Error('Invalid data');
        } else
        {
          throw new Error('Something went wrong');
        }
      } catch (error)
      {
        handleShowAlert(error.message);
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


  const fetchProfilePicture = async () =>
  {
    try
    {

      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const user_id = await AsyncStorage.getItem('user_id');

      await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
        method: 'get',
        headers: {
          'X-authorization': token,
        },
      })
        .then((response) =>
        {
          if (response.status === 200)
          {
            return response.blob();
          }
        })
        .then((rblob) =>
        {
          const data = URL.createObjectURL(rblob);
          setProfilePicture(data);
        })
        .catch((err) => (err));
    } catch (error)
    {
      // Handle fetch error
    }
  };
  console.log("permission", permission?.status == "granted")
  console.log("permission", CameraType?.back)

  return (
    <View style={styles.container}>


      {/* Modal for Camera */}
      {/* <Modal visible={isCameraModalVisible}> */}
      {isCameraModalVisible && <View style={styles.cameraContainer}>
        {
          permission && permission?.status == "granted" &&
          CameraType?.back && <Camera ref={(ref) => setCamera(ref)} style={styles.camera} type={CameraType.back} />}
        <TouchableOpacity style={styles.cameraButton} onPress={handleTakePicture}>
          <Text style={styles.cameraButtonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={() => setIsCameraModalVisible(false)}>
          <Text style={styles.cameraButtonText}>Close</Text>
        </TouchableOpacity>
      </View>}
      {/* </Modal> */}

      <CustomAlert
        visible={showAlert}
        message={alertMessage}
        onClose={handleCloseAlert}
      />
      <TouchableOpacity style={styles.profilePictureContainer} onPress={takeProfilePicture}>
        {profilePicture ? (
          <Image style={styles.profilePicture} source={{ uri: profilePicture }} />
        ) : (
          <Text style={styles.profilePicturePlaceholder}>No profile picture</Text>
        )}
        <Text style={styles.changePictureText}>Change Picture</Text>
      </TouchableOpacity>


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
  cameraContainer: {
    // flex: 1,
    backgroundColor: 'black',
    // justifyContent: 'center',
    // alignItems: 'center',
    width:"80%",
    height:400
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    padding: 5,
    marginTop: 5,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
});

export default UpdateProfileScreen;
