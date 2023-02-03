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

export const AddIngredientBtn = ({ name, amount }) => {
  return (
    <View style={styles.container}>
      <MaterialIcon name="add" size={24} color={'grey'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  content: {},
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  amount: {
    fontSize: 13,
  },
});
