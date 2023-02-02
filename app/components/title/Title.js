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

export const Title = ({ title }) => {
  return (
    <View style={style.container}>
      <Text style={style.titleFont}>{title}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    // backgroundColor: COLORS.darkGrey,
  },
  titleFont: {
    fontSize: 32,
  },
});
