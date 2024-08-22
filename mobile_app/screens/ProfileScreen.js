import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import styles from '../styles/profileStyle';

const ProfileScreen = ({navigation}) => {
  const [data, setData] = useState({
    firstName: 'Tharindu',
    lastName: 'Madusanka',
    email: 'tharindu@gmail.com',
    birthday: '18/02/1996',
    unitNumber: '4/93',
    streetName: 'Melbourne Ave',
    suburb: 'Glenroy',
    postalCode: '3046',
    state: 'VIC',
    mobile: '0415909858',
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
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleInputChange = (field, val) => {
    let isValid = val.trim().length > 0;
    if (field === 'email') {
      // Simple email validation
      isValid = /\S+@\S+\.\S+/.test(val);
    }
    setData({
      ...data,
      [field]: val,
      [`isValid${field.charAt(0).toUpperCase() + field.slice(1)}`]: isValid,
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

  const handleProfilePictureChange = () => {
    // Handle profile picture change (e.g., open image picker)
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/home.png')}
        style={styles.image}>
        <StatusBar backgroundColor="#FF6B46" barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleProfilePictureChange}>
            <Image
              alt="Not found"
              source={require('../assets/user.png')}
              style={styles.profilePicture}
            />
            <Text style={styles.changePictureText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <Text style={styles.text_footer}>First Name</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your First Name"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                value={data.firstName}
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
                value={data.lastName}
                onChangeText={val => handleInputChange('lastName', val)}
              />
            </View>
            {!data.isValidLastName && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Last name cannot be empty.</Text>
              </Animatable.View>
            )}

            <Text style={[styles.text_footer, {marginTop: 20}]}>Email</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Your Email"
                placeholderTextColor="#666666"
                style={[styles.textInput, {color: 'gray'}]}
                autoCapitalize="none"
                value={data.email}
                onChangeText={val => handleInputChange('email', val)}
                keyboardType="email-address"
              />
            </View>
            {!data.isValidEmail && (
              <Animatable.View animation="fadeInLeft">
                <Text style={styles.errorMsg}>Please enter a valid email.</Text>
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
                  style={[styles.textInput, {color: 'gray'}]}
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
                value={data.unitNumber}
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
                value={data.streetName}
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
                value={data.suburb}
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
                value={data.postalCode}
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
                value={data.mobile}
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
          </Animatable.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;
