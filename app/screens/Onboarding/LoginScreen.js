import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { COLORS, DIM } from '../../common';
import { AppButton } from '../../common/button/AppButton';
import { AppInput } from '../../common/input/AppInput';
import { Logo } from '../../common/logo/Logo';
import { auth } from '../../services/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const Spacer = () => {
  return <View style={styles.spacer} />;
};

const handleLogin = async (email, password, successCallback, errCallback) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    successCallback(userCredentials);
  } catch (err) {
    const errCode = err.code;
    const errMessage = err.message;
    errCallback(errCode, errMessage);
  }
};

export const LoginScreen = () => {
  const { user } = useAuth();
  const navigator = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signUpError = (code, message) => {
    setError(message ? message : 'Could not sign up user');
  };

  useEffect(() => {
    if (error) setError(false);
  }, [email, password]);

  const successCallback = (result) => {
    console.log('SUCCESS');
  };

  return (
    <KeyboardAvoidingView style={styles.kac} behavior={'padding'}>
      <View style={styles.box}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <View style={styles.inputContainer}>
          <AppInput
            icon="mail-outline"
            placeholder="example@example.com"
            autoFocus={true}
            text={email}
            onChangeText={setEmail}
            autoCapitalize={'none'}
            autoComplete={'off'}
          />
          <Spacer />
          <AppInput
            icon="lock-outline"
            placeholder="Password"
            autoFocus={false}
            text={password}
            onChangeText={setPassword}
            autoCapitalize={'none'}
            autoComplete={'off'}
            secureTextEntry={true}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : undefined}
        </View>
        <AppButton
          label={'Create an Account'}
          onPress={() => navigator.navigate('sign-up-screen')}
        />
        <Spacer />
        <AppButton
          label={'Login'}
          primary
          onPress={() =>
            handleLogin(email, password, successCallback, signUpError)
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  kac: {
    flex: 1,
  },
  box: {
    marginHorizontal: 3 * DIM.appMargin,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 52,
  },
  inputContainer: {
    marginBottom: 52,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 104,
  },
  spacer: {
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginVertical: 8,
  },
});
