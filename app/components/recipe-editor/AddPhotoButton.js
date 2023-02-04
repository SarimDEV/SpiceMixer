import React, { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { COLORS } from '../../common';

export const AddIngredientBtn = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>Add a photo</Text>
      <MaterialIcon name="add" size={16} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
  },
});
