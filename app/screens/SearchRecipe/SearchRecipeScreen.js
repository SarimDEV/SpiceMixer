import { useNavigation } from '@react-navigation/native';
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
import { BackButton } from '../../common/button/BackButton';
import { IngredientInput } from '../../components/recipe-editor/IngredientInput';
import { AddRecipeButton } from '../../components/recipe/AddRecipeButton';
import { Recipe } from '../../components/recipe/Recipe';
import { SearchInput } from '../../components/search/SearchInput';
import { Title } from '../../components/title/Title';
import { amountData } from '../../data';

export const SearchRecipeScreen = () => {
  const navigator = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [initRecipes, setInitRecipes] = useState([]);
  const [search, setSearch] = useState([]);
  const getRecipes = async () => {
    const res = await axios.get('/api/recipe/publish');
    setRecipes(res.data.response.sort((a, b) => a.updatedAt < b.updatedAt));
    setInitRecipes(res.data.response.sort((a, b) => a.updatedAt < b.updatedAt));
    // console.log(res.status);
    // console.log(res.data.response);
  };

  const handleSearch = (text) => {
    setSearch(text);
    // console.log(initRecipes);
    // const newRecipes = initRecipes.filter((recipe) => {
    //   if (recipe && recipe.title && recipe.description && recipe.username) {
    //     return (recipe.title.includes(text) || recipe.description.includes(text) || recipe.username.includes(text))
    //   }
    // })
    // setRecipes(newRecipes);
  }

  const handleViewScreen = (item) => {
    navigator.navigate('view-recipe-screen', {
      item,
      isPublic: true
    })
  }

  const Item = ({ item }) => (
    <TouchableOpacity activeOpacity={0.75} style={styles.item} onPress={() => handleViewScreen(item)}>
      <Recipe
        title={item.title}
        description={item.description}
        image={item.image}
        username={item.username}
      />
    </TouchableOpacity>
  );

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <View style={styles.box}>
      <View style={styles.headerContainer}>
        <BackButton navigator={navigator} />
        <View style={styles.searchInputContainer}>
          <SearchInput text={search} onChangeText={handleSearch} />
        </View>
      </View>
      <FlatList
        data={recipes}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  searchInputContainer: {
    flexGrow: 1,
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
