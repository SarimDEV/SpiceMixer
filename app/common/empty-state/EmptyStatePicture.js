import React from 'react';

import { View, StyleSheet, Text, Image } from 'react-native';

export const EmptyStatePicture = ({ title, description, source }) => (
  <View style={styles.box}>
    <View style={styles.textBox}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <Image style={styles.image} source={source} />
  </View>
);

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textBox: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
});
