import React, { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS } from '../../common';

export const AmountInput = () => {
  const [number, setNumber] = useState('1');

  const handleChangeNumber = (num) => {
    if (num === undefined || num < 0) {
      setNumber('0');
    } else if (num > 20) {
      setNumber('20');
    } else {
      setNumber(num);
    }
  };

  return (
    <TextInput
      style={styles.input}
      value={number}
      textAlign={'center'}
      onChangeText={handleChangeNumber}
      keyboardType={'number-pad'}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.darkGrey,
  },
});
