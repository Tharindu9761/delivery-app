import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../components/context';
import styles from '../styles/signinStyles';
import {mobile_login} from '../service/userService';

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const {signIn} = React.useContext(AuthContext);
  const loginImage = require('../assets/login.png');

  // Reusable alert function
  const showAlert = (title, message) => {
    Alert.alert(title, message, [{text: 'OK'}], {cancelable: true});
  };

  const textInputChange = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val)) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val)) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const handleSignIn = async () => {
    if (!data.isValidUser) {
      showAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!data.isValidPassword) {
      showAlert(
        'Invalid Password',
        'Password must be at least 8 characters long.',
      );
      return;
    }

    try {
      const result = await mobile_login(data.username, data.password);
      if (result.success) {
        signIn(result.token, result.key);
      } else {
        showAlert('Login Failed', result.message);
      }
    } catch (error) {
      console.error(error);
      showAlert('Login Failed', 'An error occurred during login.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled>
      <ImageBackground source={loginImage} style={styles.image}>
        <StatusBar backgroundColor="#FF6B46" barStyle="dark-content" />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text_header}>Sign In</Text>
          </View>
          <Animatable.View
            animation="fadeInUpBig"
            duration={1500}
            style={styles.footer}>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your email"
                keyboardType="email-address"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={textInputChange}
                onEndEditing={e => handleValidUser(e.nativeEvent.text)}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Text style={{marginRight: 10, color: 'green'}}>✔</Text>
                </Animatable.View>
              ) : null}
            </View>
            {!data.isValidUser && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Invalid email address.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>Password</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Password"
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry}
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                <Text style={{marginRight: 10, color: 'gray', fontSize: 20}}>
                  {data.secureTextEntry ? '🙈' : '👀'}
                </Text>
              </TouchableOpacity>
            </View>
            {!data.isValidPassword && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Password must be at least 8 characters long.
                </Text>
              </Animatable.View>
            )}

            <View style={styles.button}>
              <TouchableOpacity style={styles.signIn} onPress={handleSignIn}>
                <LinearGradient
                  colors={['#FFC533', '#FFC533']}
                  style={styles.signIn}>
                  <Text style={[styles.textSign, {color: '#fff'}]}>
                    Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                style={{marginTop: 15}}>
                <Text style={{color: '#FF6B46', fontSize: 16}}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUpScreen')}
                style={{marginTop: 15}}>
                <Text style={{color: '#1E90FF', fontSize: 16}}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default SignInScreen;
