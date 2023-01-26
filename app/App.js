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

const App = () => {
  return (
    <RecoilRoot>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Recipe />
      </SafeAreaView>
    </RecoilRoot>
  );
};

export default App;
