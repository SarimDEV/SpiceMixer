import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const Recipe = ({ title }) => {
  return (
    <View style={styles.recipeContainer}>
      <Image
        style={styles.spicePhoto}
        source={{
          uri: 'https://www.thecuriouschickpea.com/wp-content/uploads/2018/08/chana-masala-2.jpg.webp',
        }}
      />
      <View style={styles.recipeDescContainer}>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.recipeTitle}>{title}</Text>
            <Text style={styles.author}>Sahifa Shahid</Text>
          </View>
          <MaterialIcon name="favorite-border" size={24} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    // height: 150,
  },
  spicePhoto: {
    height: 180,
    backgroundColor: COLORS.darkGrey,
  },
  recipeDescContainer: {
    marginTop: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  author: {
    fontSize: 12,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
