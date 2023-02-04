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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { BackButton } from '../../common/button/BackButton';
import { useNavigation } from '@react-navigation/native';
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Black Pepper',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Cumin Powder',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Paprika',
  },
];

const Item = ({ title, navigator }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => navigator.navigate('select-amount-screen')}>
    <Text style={styles.title}>{title}</Text>
    <MaterialIcon name="chevron-right" size={16} />
  </TouchableOpacity>
);

export const AddIngredientScreen = () => {
  const navigator = useNavigation();

  return (
    <View style={styles.box}>
      <View style={styles.description}>
        <BackButton navigator={navigator} />
        <Text style={styles.descriptionFont}>Search and select a spice</Text>
      </View>
      <IngredientInput />
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Item title={item.title} navigator={navigator} />
        )}
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
  },
  description: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  descriptionFont: {
    color: 'grey',
  },
  headerContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  container: {
    flex: 1,
  },
  list: {
    height: '100%',
    marginTop: 24,
    marginHorizontal: -1 * DIM.appMargin,
  },
  item: {
    // backgroundColor: '#20dfae',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 5,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
