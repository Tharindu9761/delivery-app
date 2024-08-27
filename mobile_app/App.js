import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Provider as PaperProvider} from 'react-native-paper';
import {AuthContext} from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import MainScreen from './screens/MainScreen';
import RootStackScreen from './screens/RootStackScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (token, key) => {
        try {
          await AsyncStorage.setItem('Token', token);
          await AsyncStorage.setItem('Key', key);
        } catch (error) {
          console.error(error);
        }
        dispatch({type: 'LOGIN', token: token});
      },

      signOut: async () => {
        try {
          await AsyncStorage.removeItem('Token');
          await AsyncStorage.removeItem('Key');
        } catch (e) {
          console.error(e);
        }
        dispatch({type: 'LOGOUT'});
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      try {
        let token = await AsyncStorage.getItem('Token');
        dispatch({type: 'RETRIEVE_TOKEN', token: token});
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <ImageBackground
        source={require('./assets/login.png')}
        style={styles.image}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color="#009387" size="large" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <PaperProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.userToken !== null ? <MainScreen /> : <RootStackScreen />}
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
