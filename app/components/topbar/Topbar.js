import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

import { COLORS } from '../../common';

export const Topbar = () => {
  return (
    <View style={style.container}>
      <SafeAreaView>
        <View style={style.headerContainer}>
          <Text style={style.logoFont}>SpiceMixer</Text>
          <View style={style.profileIcon} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkGrey,
  },
  headerContainer: {
    marginHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
  },
  logoFont: {
    fontSize: 24,
  },
  profileIcon: {
    backgroundColor: 'green',
    borderRadius: 50,
    width: 40,
    height: 40,
  },
});
