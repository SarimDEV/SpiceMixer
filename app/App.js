import React, { useEffect } from 'react';
import { Keyboard, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { RecoilRoot } from 'recoil';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { RootNavigator } from './navigation';
import SplashScreen from 'react-native-splash-screen';
import { Topbar } from './components/topbar/Topbar';
import { ConfigureDeviceScreen } from './screens/Bluetooth/ConfigureDevice';
import { ConfigureContainerScreen } from './screens/Bluetooth/ConfigureContainer';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'white',
  },
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <RecoilRoot>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.appContainer}>
          {/* <Topbar></Topbar>
          <ConfigureDeviceScreen /> */}
          {/* <ConfigureContainerScreen /> */}
          <RootNavigator />
          {/* <RootNavigator /> */}
          {/* <SignupScreen /> */}
          {/* <LoginScreen /> */}
          {/* <Recipe /> */}
          {/* <SearchRecipeScreen /> */}
          {/* <AddIngredientScreen /> */}
          {/* <SelectAmountScreen /> */}
          {/* <ViewRecipeScreen /> */}
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
