import React from 'react';

import { Text, StyleSheet } from 'react-native';

export const Logo = () => {
  return <Text style={style.logoFont}>SpiceMixer</Text>;
};

const style = StyleSheet.create({
  logoFont: {
    fontSize: 42,
    fontWeight: '700',
  },
});
