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
import {Picker} from '@react-native-picker/picker';
import {AuthContext} from '../components/context';
import styles from '../styles/signupStyles';

const SignUpScreen = ({navigation}) => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
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
    confirmSecureTextEntry: true,
    isValidFirstName: true,
    isValidLastName: true,
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

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirmSecureTextEntry: !data.confirmSecureTextEntry,
    });
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{text: 'OK'}]);
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
                <Text style={{marginRight: 10, color: 'gray', fontSize: 20}}>
                  📅
                </Text>
              </TouchableOpacity>
            </View>
            {!data.isValidBirthday && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Please enter a valid date.</Text>
              </Animatable.View>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Unit/House or Apartment No.
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Unit/House or Apartment No."
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('unitNumber', val)}
              />
            </View>
            {!data.isValidUnitNumber && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>This field cannot be empty.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Street Name
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Street Name"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('streetName', val)}
              />
            </View>
            {!data.isValidStreetName && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>
                  Street name cannot be empty.
                </Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>Suburb</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Suburb"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('suburb', val)}
              />
            </View>
            {!data.isValidSuburb && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Suburb cannot be empty.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Postal Code
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Postal Code"
                keyboardType="numeric"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('postalCode', val)}
              />
            </View>
            {!data.isValidPostalCode && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>
                  Postal code cannot be empty.
                </Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>State</Text>
            <View style={styles.action}>
              <Picker
                selectedValue={data.state}
                style={{height: 50, width: '100%', color: '#666666'}}
                onValueChange={(itemValue, itemIndex) =>
                  handleInputChange('state', itemValue)
                }>
                <Picker.Item label="Select State" value="" />
                <Picker.Item label="New South Wales" value="NSW" />
                <Picker.Item label="Victoria" value="VIC" />
                <Picker.Item label="Queensland" value="QLD" />
                <Picker.Item label="Western Australia" value="WA" />
                <Picker.Item label="South Australia" value="SA" />
                <Picker.Item label="Tasmania" value="TAS" />
                <Picker.Item label="Northern Territory" value="NT" />
                <Picker.Item label="Australian Capital Territory" value="ACT" />
              </Picker>
            </View>
            {!data.isValidState && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Please select a state.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Mobile No.
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Mobile Number"
                keyboardType="phone-pad"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                onChangeText={val => handleInputChange('mobile', val)}
              />
            </View>
            {!data.isValidMobile && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>
                  Mobile number cannot be empty.
                </Text>
              </Animatable.View>
            )}

            {/* Password Field */}
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
                <Text style={{marginRight: 10, color: 'gray', fontSize: 20}}>
                  {data.secureTextEntry ? '🙈' : '👀'}
                </Text>
              </TouchableOpacity>
            </View>
            {!data.isValidPassword && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>
                  Password must be 8 characters long.
                </Text>
              </Animatable.View>
            )}

            {/* Confirm Password Field */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Confirm Password
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Confirm Your Password"
                placeholderTextColor="#666666"
                secureTextEntry={data.confirmSecureTextEntry}
                style={[styles.textInput, {color: 'gray', flex: 1}]}
                autoCapitalize="none"
                onChangeText={handleConfirmPasswordChange}
              />
              <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                <Text style={{marginRight: 10, color: 'gray', fontSize: 20}}>
                  {data.confirmSecureTextEntry ? '🙈' : '👀'}
                </Text>
              </TouchableOpacity>
            </View>
            {!data.isValidConfirmPassword && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Passwords do not match.</Text>
              </Animatable.View>
            )}

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
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default SignUpScreen;
