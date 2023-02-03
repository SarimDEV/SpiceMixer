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
import { Ingredient } from '../../components/recipe/Ingredient';
import { AddIngredientBtn } from '../../components/recipe-editor/AddIngredientBtn';
import { AppButton } from '../../common/button/AppButton';
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

const Item = ({ title }) => (
  <View style={styles.item}>
    <Ingredient name={title} amount={1} />
  </View>
);

const FooterItem = () => (
  <TouchableOpacity style={styles.footerItem}>
    <AddIngredientBtn />
  </TouchableOpacity>
);

export const CreateRecipeScreen = () => {
  return (
    <View style={styles.box}>
      <View style={styles.contentContainer}>
        <View style={styles.description}>
          <Text style={styles.descriptionFont}>
            Configure your own spice blend
          </Text>
        </View>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
        <FooterItem />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton label={'Save'} primary onPress={() => console.log('here')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    marginHorizontal: DIM.appMargin,
    flex: 1,
  },
  contentContainer: {
    flex: 2,
  },
  buttonContainer: {
    flex: 1,
  },
  description: {
    marginBottom: 8,
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
    // height: '50%',
    maxHeight: 300,
    // marginTop: 24,
    marginHorizontal: -1 * DIM.appMargin,
  },
  item: {
    marginBottom: 12,
    marginHorizontal: DIM.appMargin,
  },
  footerItem: {
    marginVertical: 12,
    // marginHorizontal: DIM.appMargin,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
