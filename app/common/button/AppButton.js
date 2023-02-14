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

export const AppButton = ({ label, onPress, primary, loading }) => {
  return (
    <TouchableOpacity style={style.container(primary)} onPress={onPress}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={style.label(primary)}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: (primary) => ({
    backgroundColor: primary ? 'black' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 5,
  }),
  button: {},
  label: (primary) => ({
    fontSize: 16,
    color: primary ? COLORS.darkGrey : undefined,
    textDecorationLine: primary ? undefined : 'underline',
  }),
});
