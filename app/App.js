import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
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

const App = () => {
  return (
    <RecoilRoot>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <IngredientRow />
      </SafeAreaView>
    </RecoilRoot>
  );
};

export default App;
