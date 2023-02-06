import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import NotFoundScreen from '../screens/NotFoundScreen';
import { LoginScreen } from '../screens/Onboarding/LoginScreen';
import { SignupScreen } from '../screens/Onboarding/SignupScreen';
import { SearchRecipeScreen } from '../screens/SearchRecipe/SearchRecipeScreen';
import { Topbar } from '../components/topbar/Topbar';
import { AddIngredientScreen } from '../screens/CreateRecipe/AddIngredientScreen';
import { CreateRecipeScreen } from '../screens/CreateRecipe/CreateRecipeScreen';
import { SelectAmountScreen } from '../screens/CreateRecipe/SelectAmountScreen';
import { YourRecipesScreen } from '../screens/HomeScreen/YourRecipesScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, loading } = useAuth();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={user ? UserNavigator : OnboardingNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      {/* <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group> */}
    </Stack.Navigator>
  );
};

const OnboardingStack = createNativeStackNavigator();

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator initialRouteName="Landing">
      <OnboardingStack.Screen
        name="login-screen"
        component={LoginScreen}
        options={() => ({
          title: 'Login',
          headerShown: false,
        })}
      />
      <OnboardingStack.Screen
        name="sign-up-screen"
        component={SignupScreen}
        options={() => ({
          title: 'Sign Up',
          headerShown: false,
        })}
      />
    </OnboardingStack.Navigator>
  );
}

const UserStack = createNativeStackNavigator();

function UserNavigator() {
  return (
    <>
      <Topbar />
      <UserStack.Navigator initialRouteName="your-recipes-screen">
        <UserStack.Group>
          <UserStack.Screen
            name="your-recipes-screen"
            component={YourRecipesScreen}
            options={{ headerShown: false }}
          />
          <UserStack.Screen
            name="search-recipe-screen"
            component={SearchRecipeScreen}
            options={{ headerShown: false }}
          />
          <UserStack.Screen
            name="add-ingredient-screen"
            component={AddIngredientScreen}
            options={{ headerShown: false }}
          />
          <UserStack.Screen
            name="create-recipe-screen"
            component={CreateRecipeScreen}
            options={{ headerShown: false }}
          />
          <UserStack.Screen
            name="select-amount-screen"
            component={SelectAmountScreen}
            options={{ headerShown: false }}
          />
          {/* <UserStack.Screen
      name="FriendsChat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
    <UserStack.Screen
      name="PodsChat"
      component={PodsChatScreen}
      options={{ headerShown: false }}
    />
    <UserStack.Screen
      name="AddFriends"
      component={AddFriendsScreen}
      options={{ headerShown: false }}
    />
    <UserStack.Screen
      name="Edit Profile"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <UserStack.Screen
      name="Friends Profile"
      component={FriendsProfileScreen}
      options={{ headerShown: false }}
    />
    <UserStack.Screen
      name="Group Friends"
      component={GroupFriendsScreen}
      options={{ headerShown: false }}
    /> */}
        </UserStack.Group>
      </UserStack.Navigator>
    </>
  );
}
