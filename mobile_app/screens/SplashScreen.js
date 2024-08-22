import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/splashStyles';

const GetStartedScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6B46" barStyle="light-content" />
      <ImageBackground
        source={require('../assets/get_start.png')}
        style={styles.backgroundImage}>
        <Animatable.View animation="fadeInUpBig" style={styles.logoContainer}>
          <Animatable.Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to Quick Drop</Text>
          <Text style={styles.subtitle}>
            Fast, Reliable, and Secure Deliveries
          </Text>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.getStartButton}
              onPress={() => navigation.navigate('SignInScreen')}>
              <LinearGradient
                colors={['#FFC533', '#FFC533']}
                // colors={['#FF6B46', '#FF9056']}
                style={styles.getStart}>
                <Text style={styles.getStartText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default GetStartedScreen;
