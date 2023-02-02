import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

import { COLORS, DIM } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Logo } from '../../common/logo/Logo';

export const Topbar = () => {
  return (
    <View style={style.container}>
      <SafeAreaView>
        <View style={style.headerContainer}>
          <Logo />
          <View style={style.profileIcon}>
            <MaterialIcon
              name="person-outline"
              size={24}
              color={COLORS.darkGrey}
            />
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
  profileIcon: {
    backgroundColor: 'black',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
