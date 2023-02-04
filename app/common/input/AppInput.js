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
  type = 'secondary',
  multiline = false,
}) => {
  return (
    <View style={styles.container(type, multiline)}>
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
        multiline={multiline}
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
  container: (type, multiline) => ({
    height: multiline ? 100 : 45,
    flexDirection: 'row',
    padding: 10,
    alignItems: multiline ? 'baseline' : 'center',
    // backgroundColor: COLORS.darkGrey,
    borderRadius: 18,
    borderWidth: 0.2,
    borderColor: 'grey',
  }),
});
