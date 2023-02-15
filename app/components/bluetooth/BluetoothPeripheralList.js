import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { COLORS, DIM } from '../../common';

const Item = ({ title, id, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    <MaterialIcon name="chevron-right" size={16} />
  </TouchableOpacity>
);

export const BluetoothPeripheralList = ({ list }) => {
  return (
    <View style={styles.box}>
      <FlatList
        data={list}
        renderItem={({ item }) => <Item title={item.name} id={item.id} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
  },
  description: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionFont: {
    color: 'grey',
  },
  headerContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  list: {
    marginHorizontal: -1 * DIM.appMargin,
  },
  item: {
    // backgroundColor: '#20dfae',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
