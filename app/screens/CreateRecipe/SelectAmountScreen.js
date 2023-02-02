import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
} from 'react-native';

import { COLORS, DIM } from '../../common';
import { IngredientInput } from '../../components/recipe-editor/IngredientInput';
import { Title } from '../../components/title/Title';
import { amountData } from '../../data';

const Item = ({ title }) => (
  <TouchableOpacity style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export const SelectAmountScreen = () => {
  return (
    <View style={styles.box}>
      <View style={styles.headerContainer}>
        <Title title={'Select Amount'} />
      </View>
      <FlatList
        data={amountData}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      {/* <AppButton label={'test'} onPress={() => console.log('here')} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    marginHorizontal: DIM.appMargin,
    flex: 1,
  },
  description: {
    marginBottom: 8,
  },
  headerContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  list: {
    marginHorizontal: -1 * DIM.appMargin,
  },
  item: {
    // backgroundColor: '#20dfae',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.darkGrey,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
});
