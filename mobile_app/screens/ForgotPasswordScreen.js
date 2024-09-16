import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/frogotpasswordStyles';
import CustomSnackbar from './CustomSnackbar';

const ForgotPassword = ({navigation}) => {
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    check_textInputChange: false,
    isValidUser: true,
    isValidPassword: true,
    passwordsMatch: true,
    secureTextEntry: true,
  });

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  // Reusable alert function
  const showSnackbar = (title, message, type) => {
    setSnackbar({
      visible: true,
      message: message,
      type: type,
    });
  };

  const hideSnackbar = () => {
    setSnackbar({
      ...snackbar,
      visible: false,
    });
  };

  const handlePasswordReset = () => {
    if (!data.email || !data.password || !data.confirmPassword) {
      showSnackbar('Error', 'Please fill all fields.', 'error');
      return;
    }

    if (!data.isValidUser || !data.isValidPassword || !data.passwordsMatch) {
      showSnackbar(
        'Error',
        'Please correct the errors before proceeding.',
        'error',
      );
      return;
    }
  };

  const textInputChange = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setData({
      ...data,
      email: val,
      check_textInputChange: reg.test(val),
      isValidUser: reg.test(val),
    });
  };

  const handlePasswordChange = val => {
    setData({
      ...data,
      password: val,
      isValidPassword: val.length >= 6,
      passwordsMatch: val === data.confirmPassword,
    });
  };

  const handleConfirmPasswordChange = val => {
    setData({
      ...data,
      confirmPassword: val,
      passwordsMatch: val === data.password,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled>
      <ImageBackground
        source={require('../assets/login.png')}
        style={styles.image}>
        <StatusBar backgroundColor="#FF6B46" barStyle="dark-content" />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text_header}>Reset Password</Text>
          </View>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your email"
                keyboardType="email-address"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={textInputChange}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Icon name="check-circle" size={25} color="green" />
                </Animatable.View>
              ) : null}
            </View>
            {!data.isValidUser && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Invalid email address.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>
              New Password
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="New Password"
                secureTextEntry={data.secureTextEntry}
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                <Icon
                  name={data.secureTextEntry ? 'visibility-off' : 'visibility'}
                  size={25}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {!data.isValidPassword && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Password must be at least 6 characters.
                </Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Confirm Password
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={data.secureTextEntry}
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={handleConfirmPasswordChange}
              />
            </View>
            {!data.passwordsMatch && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Passwords do not match.</Text>
              </Animatable.View>
            )}

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.reset}
                onPress={handlePasswordReset}>
                <LinearGradient
                  colors={['#FFC533', '#FFC533']}
                  style={styles.reset}>
                  <Text style={[styles.textSign, {color: '#fff'}]}>
                    Reset Password
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginTop: 15}}>
                <Text style={{color: '#FF6B46', fontSize: 16}}>
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
          {/* Snackbar */}
          {/* Using the custom Snackbar component */}
          <CustomSnackbar
            visible={snackbar.visible}
            message={snackbar.message}
            type={snackbar.type}
            onDismiss={hideSnackbar}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default ForgotPassword;
