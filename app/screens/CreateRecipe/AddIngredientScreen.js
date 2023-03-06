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
import { createIngredientState, selectedIngredientState } from './recoil/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { spiceData } from '../../data';

const Item = ({ name, navigator, spiceId, setSelectedIngredient }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => {
      setSelectedIngredient({ name, spiceId });
      navigator.navigate('select-amount-screen');
    }}>
    <Text style={styles.title}>{name}</Text>
    <MaterialIcon name="chevron-right" size={16} />
  </TouchableOpacity>
);

export const AddIngredientScreen = () => {
  const navigator = useNavigation();
  const [a, setSelectedIngredient] = useRecoilState(selectedIngredientState);
  const ingredientsData = useRecoilValue(createIngredientState);

  return (
    <View style={styles.box}>
      <View style={styles.description}>
        <BackButton navigator={navigator} />
        <Text style={styles.descriptionFont}>Search and select a spice</Text>
      </View>
      <FlatList
        data={spiceData.filter(
          (data) =>
            !ingredientsData.map((ing) => ing.spiceId).includes(data.spiceId),
        )}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            spiceId={item.spiceId}
            navigator={navigator}
            setSelectedIngredient={setSelectedIngredient}
          />
        )}
        keyExtractor={(item) => item.spiceId}
        style={styles.list}
      />
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
