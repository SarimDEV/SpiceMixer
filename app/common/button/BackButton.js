import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

import { COLORS } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const BackButton = ({ navigator }) => {
  if (navigator.canGoBack()) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigator.goBack()}>
        <MaterialIcon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    // backgroundColor: 'black',
    // padding: 8,
    marginRight: 8,
  },
});
