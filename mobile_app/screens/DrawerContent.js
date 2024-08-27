import React, { useEffect, useState } from 'react';
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
import { AuthContext } from '../components/context';
import { get_name, get_pic } from '../service/userService'; 

import styles from '../styles/drawerContentStyles';

const CustomDrawer = (props) => {
  const { signOut } = React.useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null); 

  useEffect(() => {
    const loadUserData = async () => {
      const name = await get_name();
      const avatar = await get_pic('thumb'); 
      if (name) setUserName(name);
      if (avatar) setAvatarUrl(avatar);
    };

    loadUserData();
  }, []);

  const handleSignOut = () => {
    alert('Signing out...');
    setTimeout(() => {
      signOut();
    }, 500);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: '#fff',
          marginTop: -50,
          zIndex: 10,
        }}
      >
        <ImageBackground
          source={require('../assets/get_start.png')}
          style={{ padding: 20 }}
        >
          <Image
            alt="User Avatar"
            source={avatarUrl ? { uri: avatarUrl } : require('../assets/user.png')} 
            style={styles.userAvatar}
          />
          <Text
            style={{
              color: '#05375a',
              fontSize: 18,
              marginBottom: 5,
            }}
          >
            {userName ? userName : 'Loading...'}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <LinearGradient
            colors={['#FF6B46', '#FF9056']}
            style={styles.signout}
          >
            <Text style={styles.signoutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
