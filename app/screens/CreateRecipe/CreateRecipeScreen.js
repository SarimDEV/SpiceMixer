import React, { useEffect, useState } from 'react';

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
import {
  AddIngredientBtn,
  AddPhotoButton,
} from '../../components/recipe-editor/AddPhotoButton';
import { AppButton } from '../../common/button/AppButton';
import { AppInput } from '../../common/input/AppInput';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createIngredientState } from './recoil/atoms.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { BackButton } from '../../common/button/BackButton';
import { uploadFile } from '../../components/recipe-editor/uploadFile';
import { AppDivider } from '../../common/divider/AppDivider';

const Item = ({ name, amount, deleteIngredient }) => (
  <View style={styles.item}>
    <Ingredient name={name} amount={amount} onDelete={deleteIngredient} />
  </View>
);

const Spacer = () => <View style={styles.spacer} />;

export const CreateRecipeScreen = ({ route }) => {
  const { isEdit, item } = route.params || {};
  const navigator = useNavigation();
  const { user } = useAuth();
  const [title, setTitle] = useState(item ? item.title : '');
  const [description, setDescription] = useState(item ? item.description : '');
  const [ingredientsData, setIngredientsData] = useRecoilState(
    createIngredientState,
  );
  const [isEditMode, setIsEditMode] = useState(isEdit ? true : false);
  const [currItem, setCurrItem] = useState(item ? item : {});
  const [image, setImage] = useState(
    item
      ? {
          assets: [{ uri: item.image }],
        }
      : undefined,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setIngredientsData([]);
    };
  }, [setIngredientsData]);

  useEffect(() => {
    if (currItem && currItem.ingredients) {
      setIngredientsData(
        currItem.ingredients.map((ingredient) => ({
          spiceId: ingredient.spiceId,
          name: ingredient.name,
          amount: ingredient.amount,
        })),
      );
    }
  }, [setIngredientsData, currItem]);

  const createRecipe = async () => {
    let imageUri;
    if (image && image.assets) {
      imageUri = await uploadFile(image.assets[0].uri);
    }

    const res = await axios.post('/api/recipe/create', {
      title,
      description,
      ingredients: ingredientsData,
      published: false,
      uid: user.uid,
      image: imageUri,
    });

    // console.log(res.data);
    // console.log('successfully made');
    setLoading(false);
    navigator.navigate('your-recipes-screen');
  };

  const editRecipe = async () => {
    let imageUri;
    if (image && image.assets) {
      if (currItem && image.assets[0].uri === currItem.image) {
        imageUri = currItem.image;
      } else {
        imageUri = await uploadFile(image.assets[0].uri);
      }
    }

    await axios.put(`/api/recipe/update/${currItem._id}`, {
      title,
      description,
      ingredients: ingredientsData,
      image: imageUri,
    });

    // console.log(res.data);
    console.log('successfully made');
    setLoading(false);
    navigator.navigate('your-recipes-screen');
  };

  const deleteIngredient = async (toDeleteId) => {
    setIngredientsData(
      ingredientsData.filter((something) => something.spiceId !== toDeleteId),
    );
  };

  const input = () => (
    <>
      <View style={styles.inputContainer}>
        <AppInput
          text={title}
          onChangeText={setTitle}
          placeholder={'Enter a name for your blend'}
        />
        <Spacer />
        <AppInput
          text={description}
          onChangeText={setDescription}
          placeholder={'Describe your blend'}
          multiline={true}
        />
        <Spacer />
        <AddPhotoButton image={image} setImage={setImage} />
      </View>
      <AppDivider />
    </>
  );

  const ingredients = () => {
    if (!ingredientsData || ingredientsData.length <= 0) {
      return;
    }

    return (
      <>
        <FlatList
          data={ingredientsData}
          renderItem={({ item }) => (
            <Item
              name={item.name}
              amount={item.amount}
              deleteIngredient={() => deleteIngredient(item.spiceId)}
            />
          )}
          keyExtractor={(spice) => spice.spiceId}
          style={styles.list}
        />
        <AppDivider />
      </>
    );
  };

  const buttons = () => (
    <View style={styles.buttonContainer}>
      <AppButton
        label={'Add an Ingredient'}
        onPress={() => {
          console.log(ingredientsData);
          navigator.navigate('add-ingredient-screen');
        }}
      />
      <AppButton
        loading={loading}
        label={isEditMode ? 'Edit' : 'Save'}
        primary
        onPress={() => {
          setLoading(true);
          isEditMode ? editRecipe() : createRecipe();
        }}
      />
    </View>
  );

  const indicator = () => (
    <View style={styles.description}>
      <BackButton navigator={navigator} />
      <Text style={styles.descriptionFont}>Configure your own spice blend</Text>
    </View>
  );

  return (
    <View style={styles.box}>
      {indicator()}
      {input()}
      {ingredients()}
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
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
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
