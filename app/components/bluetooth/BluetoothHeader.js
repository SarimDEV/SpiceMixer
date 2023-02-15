import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DIM } from '../../common';
import { BackButton } from '../../common/button/BackButton';
import { AppDivider } from '../../common/divider/AppDivider';

export const BluetoothHeader = ({ title, description, navigator }) => {
  return (
    <View style={styles.box}>
      <BackButton navigator={navigator} />
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <AppDivider />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
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
