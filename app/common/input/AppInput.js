import React, { useState } from 'react';

import { View, StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const AppInput = ({
  icon,
  placeholder,
  autoFocus,
  text,
  onChangeText,
  autoComplete,
  autoCapitalize,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      {icon && <MaterialIcon name={icon} size={24} />}
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 15,
    marginLeft: 12,
    marginRight: 32,
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
