import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../common';

export const BluetoothDevice = ({ name }) => {
  return (
    <View style={styles.box}>
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={require('../../public/images/factory-machine.png')}
        />
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    padding: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  image: {
    height: 175,
    width: 175,
  },
});
