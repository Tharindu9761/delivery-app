import React from 'react';
import { View, Text, ScrollView, ImageBackground, StatusBar } from 'react-native'; 
import styles from '../styles/homeStyle';


const NotificationScreen = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled>
      <ImageBackground
        source={require('../assets/home.png')}
        style={styles.image}>
        <StatusBar backgroundColor="#FF6B46" barStyle="dark-content" />
      </ImageBackground>
    </ScrollView>
  );
};

export default NotificationScreen;
