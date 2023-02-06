import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
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
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { RootNavigator } from './navigation';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'white',
  },
};

const App = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <RecoilRoot>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.appContainer}>
          <RootNavigator />
          {/* <SignupScreen /> */}
          {/* <LoginScreen /> */}
          {/* <Recipe /> */}
          {/* <SearchRecipeScreen /> */}
          {/* <AddIngredientScreen /> */}
          {/* <SelectAmountScreen /> */}
        </SafeAreaView>
      </RecoilRoot>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});

export default App;
