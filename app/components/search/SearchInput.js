import React, { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const SearchInput = () => {
  const [text, onChangeText] = useState('');

  return (
    <View style={styles.container}>
      <MaterialIcon name="search" size={24} />
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={onChangeText}
        placeholder={'Search a recipe ...'}
        autoFocus={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 15,
    marginLeft: 8,
  },
  container: {
    height: 45,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    borderRadius: 18,
  },
});
