import React from 'react';
import { Keyboard, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { RecoilRoot } from 'recoil';
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
