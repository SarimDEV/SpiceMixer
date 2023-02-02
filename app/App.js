import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Connect } from './Connect';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { Recipe } from './components/recipe/Recipe';
import { IngredientInput } from './components/recipe-editor/IngredientInput';
import { AmountInput } from './components/recipe-editor/AmountInput';
import { IngredientRow } from './components/recipe-editor/IngredientRow';
import { Topbar } from './components/topbar/Topbar';
import { AddIngredientScreen } from './screens/CreateRecipe/AddIngredientScreen';
import { SelectAmountScreen } from './screens/CreateRecipe/SelectAmountScreen';
import { SearchRecipeScreen } from './screens/SearchRecipe/SearchRecipeScreen';
import { SignupScreen } from './screens/Onboarding/SignupScreen';
import { LoginScreen } from './screens/Onboarding/LoginScreen';

const App = () => {
  return (
    <RecoilRoot>
      <StatusBar barStyle="dark-content" />
      {/* <Topbar /> */}
      <SafeAreaView style={styles.appContainer}>
        {/* <SignupScreen /> */}
        <LoginScreen />
        {/* <Recipe /> */}
        {/* <SearchRecipeScreen /> */}
        {/* <AddIngredientScreen /> */}
        {/* <SelectAmountScreen /> */}
      </SafeAreaView>
    </RecoilRoot>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});

export default App;
