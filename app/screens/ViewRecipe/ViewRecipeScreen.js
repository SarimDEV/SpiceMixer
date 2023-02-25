import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { COLORS, DIM } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Ingredient } from '../../components/recipe/Ingredient';
import { AppButton } from '../../common/button/AppButton';
import { useNavigation } from '@react-navigation/native';
import { createIngredientState } from '../CreateRecipe/recoil/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { BackButton } from '../../common/button/BackButton';
import { AppDivider } from '../../common/divider/AppDivider';
import { recipeToDevice, send } from '../../bluetooth/ble';
import { bleConnectedPeripheral } from '../../bluetooth/atoms';

const Item = ({ title, amount }) => (
  <View style={styles.item}>
    <Ingredient name={title} amount={amount} />
  </View>
);

export const ViewRecipeScreen = ({ route }) => {
  const { item, isPublic } = route.params || {};
  const [connectedPeripheral, setConnectedPeripheral] = useRecoilState(
    bleConnectedPeripheral,
  );
  const [ingredientsData, setIngredientsData] = useRecoilState(
    createIngredientState,
  );
  const [configDelete, setConfigDelete] = useState(false);
  const [isPublished, setIsPublished] = useState(item.published);
  const navigator = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      setIngredientsData([]);
    };
  }, [setIngredientsData]);

  useEffect(() => {
    if (item && item.ingredients) {
      setIngredientsData(
        item.ingredients.map((ingredient) => ({
          spiceId: ingredient.spiceId,
          name: ingredient.name,
          amount: ingredient.amount,
        })),
      );
    }
  }, [setIngredientsData, item]);

  const ingredients = () => {
    if (!ingredientsData || ingredientsData.length <= 0) {
      return;
    }

    return (
      <>
        <FlatList
          data={ingredientsData}
          renderItem={({ item }) => (
            <Item title={item.name} amount={item.amount} />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
        <AppDivider />
      </>
    );
  };

  const handleShare = async () => {
    try {
      axios.put(`/api/recipe/publish/${item._id}`);
      setIsPublished(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnshare = async () => {
    try {
      axios.put(`/api/recipe/unpublish/${item._id}`);
      setIsPublished(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`/api/recipe/create`, {
        ...item,
        uid: user.uid,
        username: user.displayName,
      });
      navigator.navigate('your-recipes-screen');
    } catch (error) {
      console.log(error);
    }
  };

  const sendRecipeToMixer = async () => {
    let data = recipeToDevice([...ingredientsData]);
    await send(connectedPeripheral.id, `!N:${data};${item.title}?`);
  };

  const buttons = () => (
    <View style={styles.buttonContainer}>
      <AppButton
        label={
          connectedPeripheral
            ? 'Download to SpiceMixer'
            : 'Connect to SpiceMixer'
        }
        onPress={() => {
          if (connectedPeripheral) {
            sendRecipeToMixer();
          } else {
            navigator.navigate('bluetooth-screen');
          }
        }}
      />
      {isPublished ? (
        <AppButton
          label={'Unshare'}
          invert
          onPress={() => {
            handleUnshare();
          }}
        />
      ) : (
        <AppButton
          label={'Share'}
          primary
          onPress={() => {
            handleShare();
          }}
        />
      )}
    </View>
  );
  const saveButton = () => (
    <View style={styles.buttonContainer}>
      <AppButton label={'Save'} primary onPress={() => handleSave()} />
    </View>
  );

  const handleDelete = async () => {
    setConfigDelete(true);
    try {
      await axios.delete(`/api/recipe/delete/${item._id}`, {
        data: {
          uid: user.uid,
        },
      });
      navigator.navigate('your-recipes-screen');
    } catch (error) {
      setConfigDelete(false);
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.box}>
        <View style={styles.topContainer}>
          <BackButton navigator={navigator} />
          {!isPublic && (
            <TouchableOpacity
              onPress={() => {
                handleDelete();
              }}>
              {configDelete ? (
                <MaterialIcon name="delete" size={24} />
              ) : (
                <MaterialIcon name="delete-outline" size={24} />
              )}
            </TouchableOpacity>
          )}
        </View>
        <Image
          style={styles.spicePhoto}
          source={
            item.image
              ? {
                  uri: item.image,
                }
              : {
                  uri: 'https://www.homestratosphere.com/wp-content/uploads/2019/04/Different-types-of-spices-of-the-table-apr18-870x561.jpg.webp',
                }
          }
        />
        <View style={styles.textContainer}>
          <Text style={styles.hello}>{item.title}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={{ color: 'grey' }}>Spices</Text>
        <AppDivider />
        {ingredients()}
        {isPublic ? saveButton() : buttons()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollview: {
    marginVertical: 16,
  },
  box: {
    marginTop: 16,
    marginHorizontal: DIM.appMargin,
    // flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  inputContainer: {
    // flex: 2,
  },
  buttonContainer: {
    // flex: 1,
  },
  description: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    // color: 'grey',
    marginTop: 10,
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
  hello: {
    fontSize: 24,
    fontWeight: '500',
  },
  spicePhoto: {
    height: 180,
    backgroundColor: COLORS.darkGrey,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
