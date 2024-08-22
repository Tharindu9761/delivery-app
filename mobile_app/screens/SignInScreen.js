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
import { AuthContext } from '../components/context';
import styles from '../styles/signinStyles';

const SignInScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const { signIn } = React.useContext(AuthContext);

  const textInputChange = (val) => {
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

  const handlePasswordChange = (val) => {
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

  const handleValidUser = (val) => {
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

  const handleSignIn = () => {
    // Add your authentication logic here
    signIn();  // Assuming you are using the context to manage sign-in state
    navigation.replace('MainScreen'); // Navigate to MainScreen and replace SignInScreen
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled>
      <ImageBackground
        source={require('../assets/login.png')}
        style={styles.image}>
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
                style={[styles.textInput, { color: 'gray' }]}
                autoCapitalize="none"
                onChangeText={textInputChange}
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Text style={{ marginRight: 10, color: 'green' }}>✔</Text>
                </Animatable.View>
              ) : null}
            </View>
            {!data.isValidUser && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Invalid email address.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, { marginTop: 20 }]}>Password</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Password"
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry}
                style={[styles.textInput, { color: 'gray' }]}
                autoCapitalize="none"
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                <Text style={{ marginRight: 10, color: 'gray', fontSize: 20 }}>
                  {data.secureTextEntry ? '🙈' : '👀'}
                </Text>
              </TouchableOpacity>
            </View>
            {!data.isValidPassword && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Password must be 8 characters long.
                </Text>
              </Animatable.View>
            )}

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => navigation.navigate('MainScreen')}
                >
                <LinearGradient
                  colors={['#FFC533', '#FFC533']}
                  style={styles.signIn}>
                  <Text style={[styles.textSign, { color: '#fff' }]}>
                    Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                style={{ marginTop: 15 }}>
                <Text style={{ color: '#FF6B46', fontSize: 16 }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUpScreen')}
                style={{ marginTop: 15 }}>
                <Text style={{ color: '#1E90FF', fontSize: 16 }}>
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
