import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const Recipe = () => {
  return (
    <View style={styles.recipeContainer}>
      <View style={styles.spicePhoto} />
      <View style={styles.recipeDescContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.recipeTitle}>Channa Masala</Text>
          <MaterialIcon name="view-headline" size={24} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    flexDirection: 'row',
  },
  spicePhoto: {
    height: 110,
    width: 110,
    backgroundColor: COLORS.darkGrey,
  },
  recipeDescContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.primary,
    height: 110,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  recipeTitle: {
    fontSize: 16,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
