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
import { AddIngredientBtn } from '../../components/recipe-editor/AddPhotoButton';
import { AppButton } from '../../common/button/AppButton';
import { AppInput } from '../../common/input/AppInput';
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Black Pepper',
  },
  {
    id: 'bd7acbed-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Pepper',
  },
  {
    id: 'bd7acbef-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Green Pepper',
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Ingredient name={title} amount={1} />
  </View>
);

const Spacer = () => <View style={styles.spacer} />;
const LineSpacer = () => <View style={styles.lineSpacer} />;

export const CreateRecipeScreen = () => {
  const input = () => (
    <View style={styles.inputContainer}>
      <AppInput placeholder={'Enter a name for your blend'} />
      <Spacer />
      <AppInput placeholder={'Describe your blend'} multiline={true} />
      <Spacer />
      <AddIngredientBtn />
    </View>
  );

  const ingredients = () => {
    if (!DATA || DATA.length <= 0) {
      return;
    }

    return (
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    );
  };

  const buttons = () => (
    <View style={styles.buttonContainer}>
      <AppButton
        label={'Add an Ingredient'}
        onPress={() => console.log('here')}
      />
      <AppButton label={'Save'} primary onPress={() => console.log('here')} />
    </View>
  );

  const description = () => (
    <View style={styles.description}>
      <Text style={styles.descriptionFont}>Configure your own spice blend</Text>
    </View>
  );

  return (
    <View style={styles.box}>
      {description()}
      {input()}
      <LineSpacer />
      {ingredients()}
      <LineSpacer />
      {buttons()}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    marginHorizontal: DIM.appMargin,
    // flex: 1,
  },
  lineSpacer: {
    marginVertical: 16,
    height: 1,
    borderTopWidth: 1,
    color: '#E4E4E4',
    opacity: 0.2,
  },
  inputContainer: {
    // flex: 2,
  },
  buttonContainer: {
    // flex: 1,
  },
  description: {
    marginBottom: 8,
  },
  descriptionFont: {
    color: 'grey',
  },
  spacer: {
    marginBottom: 12,
  },
  list: {
    maxHeight: 200,
    marginHorizontal: -1 * DIM.appMargin,
  },
  item: {
    marginBottom: 12,
    marginHorizontal: DIM.appMargin,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
