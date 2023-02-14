import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { signOut } from 'firebase/auth';

import { COLORS, DIM } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Logo } from '../../common/logo/Logo';
import { auth } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';

export const Topbar = () => {
  const navigator = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      const errCode = err.code;
      const errMessage = err.message;
      console.log(errCode);
      console.log(errMessage);
    }
  };

  return (
    <View style={style.container}>
      <SafeAreaView>
        <View style={style.headerContainer}>
          <Logo />
          <View style={style.iconContainer}>
            <TouchableOpacity
              style={style.blutoothIcon}
              onPress={() => navigator.navigate('bluetooth-screen')}>
              <MaterialIcon name="bluetooth" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              style={style.profileIcon}
              onPress={() => handleLogout()}>
              <MaterialIcon
                name="person-outline"
                size={24}
                color={COLORS.darkGrey}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    // backgroundColor: COLORS.darkGrey,
  },
  headerContainer: {
    marginHorizontal: DIM.appMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
  },
  logoFont: {
    fontSize: 42,
    fontWeight: '700',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  blutoothIcon: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    backgroundColor: 'black',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
