import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { COLORS, DIM } from '../../common';
import { AppButton } from '../../common/button/AppButton';
import { AppInput } from '../../common/input/AppInput';
import { Logo } from '../../common/logo/Logo';
import { auth } from '../../services/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import { authDisplayName } from '../../auth/atoms';

const Spacer = () => {
  return <View style={styles.spacer} />;
};

const handleSignUp = async (
  email,
  password,
  name,
  successCallback,
  errCallback,
) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredentials.user, {
      displayName: name,
    });

    await userCredentials.user.reload();

    await axios.post('/api/user/create', {
      name,
      uid: userCredentials.user.uid,
    });

    successCallback();
  } catch (err) {
    const errCode = err.code;
    const errMessage = err.message;
    errCallback(errCode, errMessage);
  }
};

export const SignupScreen = () => {
  const { user, signingUp, setSigningUp } = useAuth();
  const navigator = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [_, setDisplayName] = useRecoilState(authDisplayName);

  const signUpError = (code, message) => {
    setSigningUp(false);
    setError(message ? message : 'Could not sign up user');
  };

  useEffect(() => {
    if (error) {
      setError(false);
    }
  }, [email, name, password]);

  const successCallback = () => {
    setDisplayName(name);
    setSigningUp(false);
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
            icon="person-outline"
            placeholder="John Doe"
            autoFocus={false}
            text={name}
            onChangeText={setName}
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
        <View style={styles.btnContainer}>
          <AppButton
            label={'Back to Login'}
            onPress={() => navigator.navigate('login-screen')}
          />
          <Spacer />
          <AppButton
            loading={signingUp}
            label={'Sign Up'}
            primary
            onPress={() => {
              setSigningUp(true);
              handleSignUp(email, password, name, successCallback, signUpError);
            }}
          />
        </View>
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
  },
  btnContainer: {
    flex: 1.5,
    justifyContent: 'center',
    marginBottom: 16,
    // backgroundColor: 'blue',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'orange',
  },
  spacer: {
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginVertical: 8,
  },
});
