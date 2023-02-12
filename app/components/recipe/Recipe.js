import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const Recipe = ({ title, icon, description, image }) => {
  return (
    <View style={styles.recipeContainer}>
      <Image
        style={styles.spicePhoto}
        source={{
          uri: image ? image : 'https://www.homestratosphere.com/wp-content/uploads/2019/04/Different-types-of-spices-of-the-table-apr18-870x561.jpg.webp',
        }}
      />
      <View style={styles.recipeDescContainer}>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.recipeTitle}>{title}</Text>
            <Text style={styles.author}>{description}</Text>
          </View>
          <MaterialIcon name={icon ? icon : 'favorite-border'} size={24} />
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
