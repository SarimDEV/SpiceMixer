import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import { DIM } from '../../common';
import { BackButton } from '../../common/button/BackButton';
import { Recipe } from '../../components/recipe/Recipe';
import { SearchInput } from '../../components/search/SearchInput';
import { useDebounce } from '../../hooks/useDebounce';

const GlobalRecipes = React.memo(({ navigator, recipes }) => {
  const handleViewScreen = (item) => {
    navigator.navigate('view-recipe-screen', {
      item,
      isPublic: true,
    });
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.item}
      onPress={() => handleViewScreen(item)}>
      <Recipe
        title={item.title}
        description={item.description}
        image={item.image}
        username={item.username.split(' ')[0]}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={recipes}
      renderItem={({ item }) => <Item item={item} />}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
});

export const SearchRecipeScreen = () => {
  const navigator = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [initRecipes, setInitRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const getRecipes = async () => {
    const res = await axios.get('/api/recipe/publish');
    setRecipes(res.data.response.sort((a, b) => a.updatedAt < b.updatedAt));
    setInitRecipes(res.data.response.sort((a, b) => a.updatedAt < b.updatedAt));
  };

  useDebounce(
    () => {
      if (search === '') {
        return setRecipes(initRecipes);
      } else {
        const newRecipes = initRecipes.filter((recipe) => {
          if (recipe && recipe.title && recipe.description && recipe.username) {
            return (
              recipe.title.toLowerCase().includes(search.toLowerCase()) ||
              recipe.description.toLowerCase().includes(search.toLowerCase()) ||
              recipe.username.toLowerCase().includes(search.toLowerCase())
            );
          }
        });
        setRecipes(newRecipes);
      }
    },
    [search, initRecipes],
    300,
  );

  const handleSearch = (text) => {
    setSearch(text);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <View style={styles.box}>
      <View style={styles.headerContainer}>
        <BackButton navigator={navigator} />
        <View style={styles.searchInputContainer}>
          <SearchInput
            text={search}
            onChangeText={handleSearch}
            autoFocus={false}
          />
        </View>
      </View>
      <GlobalRecipes recipes={recipes} navigator={navigator} />
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
