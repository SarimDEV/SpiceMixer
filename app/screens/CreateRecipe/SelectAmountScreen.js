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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { BackButton } from '../../common/button/BackButton';
import { useNavigation } from '@react-navigation/native';

const Item = ({ title, navigator }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => navigator.navigate('create-recipe-screen')}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export const SelectAmountScreen = () => {
  const navigator = useNavigation();

  return (
    <View style={styles.box}>
      <View style={styles.description}>
        <BackButton navigator={navigator} />
        <Text style={styles.descriptionText}>Select an amount</Text>
      </View>
      <FlatList
        data={amountData}
        renderItem={({ item }) => (
          <Item title={item.title} navigator={navigator} />
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionFont: {
    color: 'grey',
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
    borderBottomColor: COLORS.primary,
    // alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
