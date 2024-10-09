import React from 'react';
import {Snackbar} from 'react-native-paper';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomSnackbar = ({visible, message, type, onDismiss}) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={2500}
      action={{
        label: <Icon name="close" size={20} color="#FFFFFF" />,
        onPress: onDismiss,
      }}
      style={{
        backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        borderRadius: 10,
      }}>
      <Text style={{color: '#FFFFFF'}}>{message}</Text>
    </Snackbar>
  );
};

export default CustomSnackbar;
