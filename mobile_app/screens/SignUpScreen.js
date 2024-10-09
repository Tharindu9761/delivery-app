import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AuthContext} from '../components/context';
import styles from '../styles/signupStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomSnackbar from './CustomSnackbar';

const SignUpScreen = ({navigation}) => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    unitNumber: '',
    streetName: '',
    suburb: '',
    postalCode: '',
    state: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    secureTextEntry: true,
    isValidFirstName: true,
    isValidLastName: true,
    isValidEmail: true,
    isValidBirthday: true,
    isValidUnitNumber: true,
    isValidStreetName: true,
    isValidSuburb: true,
    isValidPostalCode: true,
    isValidState: true,
    isValidMobile: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const {signUp} = React.useContext(AuthContext);

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

  const handleInputChange = (field, val) => {
    let isValid = val.trim().length > 0;
    setData({
      ...data,
      [field]: val,
      [`isValid${field.charAt(0).toUpperCase() + field.slice(1)}`]: isValid,
    });
  };

  const handlePasswordChange = val => {
    setData({
      ...data,
      password: val,
      isValidPassword: val.trim().length >= 6,
    });
  };

  const handleConfirmPasswordChange = val => {
    setData({
      ...data,
      confirmPassword: val,
      isValidConfirmPassword: val.trim() === data.password,
    });
  };

  const handleValidUser = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val)) {
      setData({
        ...data,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        isValidEmail: false,
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    let formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${currentDate.getFullYear()}`;
    handleInputChange('birthday', formattedDate);
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{text: 'OK'}]);
  };

  const textInputChange = val => {
    handleInputChange('email', val);
    handleValidUser(val);
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled>
      <ImageBackground
        source={require('../assets/login.png')}
        style={styles.image}>
        <StatusBar backgroundColor="#FF6B46" barStyle="dark-content" />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text_header}>Sign Up</Text>
          </View>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            {/* First Name */}
            <Text style={styles.text_footer}>First Name</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your First Name"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('firstName', val)}
              />
            </View>
            {!data.isValidFirstName && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>First name cannot be empty.</Text>
              </Animatable.View>
            )}

            {/* Last Name */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>Last Name</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Last Name"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('lastName', val)}
              />
            </View>
            {!data.isValidLastName && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Last name cannot be empty.</Text>
              </Animatable.View>
            )}

            {/* Email */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>Email</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Email"
                keyboardType="email-address"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={textInputChange}
              />
            </View>
            {!data.isValidEmail && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Invalid email address.</Text>
              </Animatable.View>
            )}

            {/* Birthday */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>Birthday</Text>
            <View style={styles.action}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#666666"
                  style={[styles.textInput, {color: 'gray', flex: 1}]}
                  autoCapitalize="none"
                  value={data.birthday}
                  editable={false}
                />
                <Icon
                  name="calendar-today"
                  size={25}
                  color="gray"
                  style={{marginRight: 0}}
                />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Password */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>Password</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Password"
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry}
                style={[styles.textInput, {color: 'gray', flex: 1}]}
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
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>
                  Password must be 8 characters long.
                </Text>
              </Animatable.View>
            )}

            {/* Confirm Password */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Confirm Password
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Confirm Your Password"
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry}
                style={[styles.textInput, {color: 'gray', flex: 1}]}
                autoCapitalize="none"
                onChangeText={handleConfirmPasswordChange}
              />
            </View>
            {!data.isValidConfirmPassword && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Passwords do not match.</Text>
              </Animatable.View>
            )}

            {/* Sign Up Buttons */}
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={() => showAlert('Info', 'Sign Up button pressed')}>
                <LinearGradient
                  colors={['#FFC533', '#FFC533']}
                  style={styles.signUp}>
                  <Text style={[styles.textSign, {color: '#fff'}]}>
                    Sign Up as Customer
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.signUp, {marginTop: 20}]}
                onPress={() =>
                  showAlert('Info', 'Sign Up as Delivery Driver button pressed')
                }>
                <LinearGradient
                  colors={['#FF6B46', '#FF9056']}
                  style={styles.signUp}>
                  <Text style={[styles.textSign, {color: '#fff'}]}>
                    Sign Up as Delivery Driver
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginTop: 15}}>
                <Text style={{color: '#1E90FF', fontSize: 16}}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>

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

export default SignUpScreen;
