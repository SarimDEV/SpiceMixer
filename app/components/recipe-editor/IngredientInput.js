import React, { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS } from '../../common';

export const IngredientInput = () => {
  const [text, onChangeText] = useState('');

  return (
    <TextInput
      style={styles.input}
      value={text}
      onChangeText={onChangeText}
      placeholder={'Tumeric ...'}
      autoFocus={true}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.darkGrey,
  },
});
