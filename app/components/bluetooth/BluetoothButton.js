import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DIM } from '../../common';
import { BackButton } from '../../common/button/BackButton';
import { AppDivider } from '../../common/divider/AppDivider';
import { AppButton } from '../../common/button/AppButton';

export const BluetoothButton = ({ title, onPress, primary }) => {
  return <AppButton label={title} onPress={onPress} primary={primary} />;
};

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    marginHorizontal: DIM.appMargin,
  },
  titleBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B6B6B6',
    marginTop: 8,
  },
});
