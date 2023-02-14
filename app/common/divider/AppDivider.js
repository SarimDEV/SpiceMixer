import React from 'react';

import { View, StyleSheet } from 'react-native';

export const AppDivider = () => <View style={styles.lineSpacer} />;

const styles = StyleSheet.create({
  lineSpacer: {
    marginVertical: 16,
    height: 1,
    borderTopWidth: 1,
    color: '#E4E4E4',
    opacity: 0.2,
  },
});
