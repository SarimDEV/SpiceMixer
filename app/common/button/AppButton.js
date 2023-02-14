import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { COLORS } from '../../common';

export const AppButton = ({ label, onPress, primary, loading, invert }) => {
  return (
    <TouchableOpacity style={style.container(primary, invert)} onPress={onPress}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={style.label(primary, invert)}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: (primary, invert) => ({
    backgroundColor: primary ? 'black' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: invert ? 1 : undefined
  }),
  button: {},
  label: (primary, invert) => ({
    fontSize: 16,
    color: primary ? COLORS.darkGrey : undefined,
    textDecorationLine: primary || invert ? undefined : 'underline',
  }),
});
