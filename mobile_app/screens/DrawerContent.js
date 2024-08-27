import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../components/context';

import styles from '../styles/drawerContentStyles';

const CustomDrawer = props => {
  const {navigation} = props;

  const {signOut} = React.useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
    alert('Signing out...');

    // navigation.replace('SignInScreen');
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: '#fff',
          marginTop: -50,
          zIndex: 10,
        }}>
        <ImageBackground
          source={require('../assets/get_start.png')}
          style={{padding: 20}}>
          <Image
            alt="Not found"
            source={require('../assets/user.png')}
            style={styles.userAvatar}
          />
          <Text
            style={{
              color: '#05375a',
              fontSize: 18,
              marginBottom: 5,
            }}>
            Tharindu Madusanka
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <LinearGradient
            // colors={['#FFC533', '#FFC533']}
            colors={['#FF6B46', '#FF9056']}
            style={styles.signout}>
            <Text style={styles.signoutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
