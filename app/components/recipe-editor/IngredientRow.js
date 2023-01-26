import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { AmountInput } from './AmountInput';
import { IngredientInput } from './IngredientInput';

export const IngredientRow = () => {
  return (
    <View style={styles.container}>
      <View style={styles.ingredientInputContainer}>
        <IngredientInput />
      </View>
      <View style={styles.amountInputContainer}>
        <AmountInput />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  ingredientInputContainer: {
    flex: 4,
  },
  amountInputContainer: {
    flex: 2,
  },
});
