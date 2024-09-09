import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppConst from '../const/const';
const {jwtDecode} = require('jwt-decode');

export async function mobile_login(email, password) {
  try {
    const response = await fetch(AppConst.LOGIN_MOBILE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const res = await response.json();
    if (response.ok && res) {
      if (res.token) {
        return {
          success: true,
          token: res.token,
          key: res.key,
        };
      } else {
        return {
          success: false,
          message: res.message || 'Login failed',
        };
      }
    } else {
      return {
        success: false,
        message: res.message || 'Invalid email or password',
      };
    }
  } catch (error) {
    console.error('Login error: aaaa', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
}

export async function get_email() {
  try {
    const userToken = await AsyncStorage.getItem('Token');
    if (userToken) {
      const user = jwtDecode(userToken);
      return user.email;
    }
    return null;
  } catch (error) {
    console.error('Error fetching email:', error);
    return null;
  }
}

export async function get_name() {
  try {
    const userToken = await AsyncStorage.getItem('Token');
    if (userToken) {
      const user = jwtDecode(userToken);
      const name = user.first_name + ' ' + user.last_name;
      return name;
    }
    return null;
  } catch (error) {
    console.error('Error fetching email:', error);
    return null;
  }
}

export async function get_user_id() {
  try {
    const userToken = await AsyncStorage.getItem('Token');
    if (userToken) {
      const user = jwtDecode(userToken);
      return user._id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
}

export async function get_user_role() {
  try {
    const userToken = await AsyncStorage.getItem('Token');

    if (userToken) {
      const user = jwtDecode(userToken);
      console.log(user);
      return user.user_type;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function get_user_details() {
  try {
    const userToken = await AsyncStorage.getItem('Token');
    if (userToken) {
      const response = await fetch(AppConst.FIND_USER, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userToken,
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();
      if (response.ok && res.success) {
        return res.data;
      } else {
        console.error('Failed to fetch user details:', res.message);
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

export async function get_pic(type) {
  try {
    const userToken = await AsyncStorage.getItem('Token');
    if (userToken) {
      const user = jwtDecode(userToken);

      const url =
        type === 'thumb'
          ? AppConst.PIC_THUMB(user.id)
          : AppConst.PIC_FULL(user.id);

      return url;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
}
