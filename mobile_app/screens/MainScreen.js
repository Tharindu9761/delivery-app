import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

import DrawerContent from '../screens/DrawerContent';
import HomeScreenCustomer from './HomeScreenCustomer';
import HomeScreenDriver from './HomeScreenDriver';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

import {get_user_role} from '../service/userService';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const userRole = await get_user_role();
        setRole(userRole);
      } catch (error) {
        console.error('Failed to load user role:', error);
      }
    };

    loadRole();
  }, []);

  if (role === null) {
    return null;
  }

  return (
    <Drawer.Navigator
      initialRouteName={role === 'Driver' ? 'HomeDriver' : 'HomeCustomer'}
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B46',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}>
      {role === 'Customer' && (
        <Drawer.Screen
          name="HomeCustomer"
          component={HomeScreenCustomer}
          options={{
            title: 'Home',
            drawerIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
      )}
      {role === 'Driver' && (
        <Drawer.Screen
          name="HomeDriver"
          component={HomeScreenDriver}
          options={{
            title: 'Home',
            drawerIcon: ({color, size}) => (
              <Icon name="directions-car" color={color} size={size} />
            ),
          }}
        />
      )}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({color, size}) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
          drawerIcon: ({color, size}) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          drawerIcon: ({color, size}) => (
            <Icon name="notifications" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function MainScreen() {
  return <MyDrawer />;
}
