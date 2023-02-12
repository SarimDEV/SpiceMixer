import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import { COLORS, DIM } from '../../common';
import { IngredientInput } from '../../components/recipe-editor/IngredientInput';
import { AddRecipeButton } from '../../components/recipe/AddRecipeButton';
import { Recipe } from '../../components/recipe/Recipe';
import { SearchInput } from '../../components/search/SearchInput';
import { Title } from '../../components/title/Title';
import { amountData } from '../../data';
import { useAuth } from '../../hooks/useAuth';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authDisplayName } from '../../auth/atoms';

const Item = ({ title, description, image }) => (
  <TouchableOpacity activeOpacity={0.75} style={styles.item}>
    <Recipe
      title={title}
      icon={'edit'}
      description={description}
      image={image}
    />
  </TouchableOpacity>
);

const FooterItem = () => <View marginBottom={75} />;

export const YourRecipesScreen = () => {
  const { user } = useAuth();
  const displayName = useRecoilValue(authDisplayName);
  const navigator = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getRecipes = async () => {
      const res = await axios.get(`/api/user/read/${user.uid}`);
      setRecipes(res.data[0].recipes);
      console.log(res.data[0].recipes);
    };
    getRecipes();
  }, [isFocused, user]);

  return (
    <>
      <View style={styles.box}>
        <View style={styles.headerContainer}>
          <Text style={styles.hello}>Hi, {displayName.split(' ')[0]}</Text>
          <TouchableOpacity
            onPress={() => navigator.navigate('search-recipe-screen')}>
            <MaterialIcon name="search" size={32} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              description={item.description}
              image={item.image}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListFooterComponent={<FooterItem />}
        />
      </View>
      <AddRecipeButton />
    </>
  );
};

const styles = StyleSheet.create({
  hello: {
    fontSize: 24,
    fontWeight: '500',
  },
  box: {
    marginHorizontal: DIM.appMargin,
    flex: 1,
  },
  description: {
    marginBottom: 8,
  },
  headerContainer: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    marginHorizontal: -1 * DIM.appMargin,
  },
  item: {
    marginTop: 16,
    marginHorizontal: DIM.appMargin,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
  },
});
