import { stringToBytes } from 'convert-string';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Button,
  FlatList,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { AppDivider } from '../../common/divider/AppDivider';
import { BackButton } from '../../common/button/BackButton';
import { COLORS, DIM } from '../../common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
import { useNavigation } from '@react-navigation/native';
import { BluetoothHeader } from '../../components/bluetooth/BluetoothHeader';
import { BluetoothButton } from '../../components/bluetooth/BluetoothButton';
import { BluetoothPeripheralList } from '../../components/bluetooth/BluetoothPeripheralList';
import { useRecoilValue } from 'recoil';
import { configureSpices } from './recoil/atom';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const ConfigureDeviceScreen = () => {
    const navigator = useNavigation();
    const list = useRecoilValue(configureSpices)


  const Item = ({ name, id, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View>
      <Text style={styles.title(name)}>{name ? name : "Select Spice..."}</Text>
      <Text>Container {id}</Text>
      </View>
      <MaterialIcon name="chevron-right" size={16} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.box}>
        <BackButton navigator={navigator} />
      <View style={styles.headerBox}>
        <BluetoothHeader
          navigator={navigator}
          title="Configure your Device!"
          description="Select the spices in your SpiceMixer containers!"
        />
      </View>
      <View style={styles.centerBox}>
      <FlatList
        data={list}
        renderItem={({ item, index }) => <Item name={item.name} id={index + 1} onPress={() => {navigator.navigate("configure-container-screen", { index })}}/>}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      </View>
      <View style={styles.buttonBox}>
        <BluetoothButton
          title="Configure Spice Mixer"
          onPress={() => console.log("hey")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    flex: 3,
    // backgroundColor: 'red',
  },
  centerBox: {
    flex: 10,
    // backgroundColor: 'yellow',
  },
  buttonBox: {
    flex: 2,
    // backgroundColor: 'green',
  },
  box: {
    marginHorizontal: DIM.appMargin,
    flex: 1,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
//   box: {
//     flex: 1,
//   },
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
    borderRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: (name) => ({
    fontSize: 16,
    fontWeight: '500',
    color: name ? 'black' : 'grey'
  }),
});
