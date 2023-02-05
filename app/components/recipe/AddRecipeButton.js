import { useNavigation } from '@react-navigation/native';
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

export const AddRecipeButton = ({ name, amount }) => {
  const navigator = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigator.navigate('create-recipe-screen')}>
      <MaterialIcon name="add" size={24} color={'white'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 0,
    padding: 18,
    backgroundColor: 'black',
    borderRadius: 50,
  },
});
