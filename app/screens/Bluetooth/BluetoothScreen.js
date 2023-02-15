// import { stringToBytes } from 'convert-string';
// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   NativeModules,
//   NativeEventEmitter,
//   Button,
//   FlatList,
//   TouchableHighlight,
// } from 'react-native';

// import { Colors } from 'react-native/Libraries/NewAppScreen';

// import BleManager from 'react-native-ble-manager';
// import { COLORS, DIM } from '../../common';
// import { AppDivider } from '../../common/divider/AppDivider';
// import { BackButton } from '../../common/button/BackButton';
// import { useNavigation } from '@react-navigation/native';
// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const Item = ({ item }) => {
//   return (
//     <View>
//       <Text>{item.name}</Text>
//     </View>
//   );
// };

// export const BluetoothScreen = () => {
//   const navigator = useNavigation();
//   const [isScanning, setIsScanning] = useState(false);
//   const peripherals = new Map();
//   const [list, setList] = useState([]);

//   const startScan = () => {
//     if (!isScanning) {
//       BleManager.scan(['FFE0'], 3, false)
//         .then((results) => {
//           console.log('Scanning...');
//           setIsScanning(true);
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     }
//   };

//   /**
//    * When done scanning, set the scanning state to false
//    */
//   const handleStopScan = () => {
//     console.log('Scan is stopped');
//     setIsScanning(false);
//   };

//   /**
//    * When the peripheral disconnects, change its connected property
//    * to false and update the map and state list
//    * @param {*} data
//    */
//   const handleDisconnectedPeripheral = (data) => {
//     let peripheral = peripherals.get(data.peripheral);
//     if (peripheral) {
//       peripheral.connected = false;
//       peripherals.set(peripheral.id, peripheral);
//       setList(Array.from(peripherals.values()));
//     }
//     console.log('Disconnected from ' + data.peripheral);
//   };

//   /**
//    * Just console.log stuff
//    * @param {*} data
//    */
//   const handleUpdateValueForCharacteristic = (data) => {
//     console.log(
//       'Received data from ' +
//         data.peripheral +
//         ' characteristic ' +
//         data.characteristic,
//       data.value,
//     );
//   };

//   const retrieveConnected = () => {
//     BleManager.getConnectedPeripherals([]).then((results) => {
//       if (results.length === 0) {
//         console.log('No connected peripherals');
//       }
//       console.log(results);
//       for (var i = 0; i < results.length; i++) {
//         var peripheral = results[i];
//         peripheral.connected = true;
//         peripherals.set(peripheral.id, peripheral);
//         setList(Array.from(peripherals.values()));
//       }
//     });
//   };

//   /**
//    * When you discover a peripheral, add a default name and
//    * add the peripheral to both the Map and the state list.
//    * @param {*} peripheral
//    */
//   const handleDiscoverPeripheral = (peripheral) => {
//     console.log('Got ble peripheral', peripheral);
//     if (!peripheral.name) {
//       peripheral.name = 'NO NAME';
//     }
//     peripherals.set(peripheral.id, peripheral);
//     setList(Array.from(peripherals.values()));
//   };

//   const testPeripheral = (peripheral) => {
//     if (peripheral) {
//       if (peripheral.connected) {
//         BleManager.disconnect(peripheral.id);
//       } else {
//         BleManager.connect(peripheral.id)
//           .then(() => {
//             let p = peripherals.get(peripheral.id);
//             if (p) {
//               p.connected = true;
//               peripherals.set(peripheral.id, p);
//               setList(Array.from(peripherals.values()));
//             }
//             console.log('Connected to ' + peripheral.id);

//             setTimeout(() => {
//               /* Test read current RSSI value */
//               BleManager.retrieveServices(peripheral.id).then(
//                 (peripheralData) => {
//                   console.log('Retrieved peripheral services', peripheralData);

//                   BleManager.writeWithoutResponse(
//                     peripheral.id,
//                     'FFE0',
//                     'FFE1',
//                     stringToBytes('CON'),
//                   )
//                     .then((data) => {
//                       // Success code
//                       console.log('Writed: ' + data);
//                     })
//                     .catch((error) => {
//                       // Failure code
//                       console.log(error);
//                     });

//                   BleManager.readRSSI(peripheral.id).then((rssi) => {
//                     console.log('Retrieved actual RSSI value', rssi);
//                     let p = peripherals.get(peripheral.id);
//                     if (p) {
//                       p.rssi = rssi;
//                       peripherals.set(peripheral.id, p);
//                       setList(Array.from(peripherals.values()));
//                     }
//                   });
//                 },
//               );
//             }, 900);
//           })
//           .catch((error) => {
//             console.log('Connection error', error);
//           });
//       }
//     }
//   };

//   useEffect(() => {
//     BleManager.start({ showAlert: false });

//     bleManagerEmitter.addListener(
//       'BleManagerDiscoverPeripheral',
//       handleDiscoverPeripheral,
//     );
//     bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
//     bleManagerEmitter.addListener(
//       'BleManagerDisconnectPeripheral',
//       handleDisconnectedPeripheral,
//     );
//     bleManagerEmitter.addListener(
//       'BleManagerDidUpdateValueForCharacteristic',
//       handleUpdateValueForCharacteristic,
//     );

//     startScan();

//     return () => {
//       console.log('unmount');
//       bleManagerEmitter.removeListener(
//         'BleManagerDiscoverPeripheral',
//         handleDiscoverPeripheral,
//       );
//       bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
//       bleManagerEmitter.removeListener(
//         'BleManagerDisconnectPeripheral',
//         handleDisconnectedPeripheral,
//       );
//       bleManagerEmitter.removeListener(
//         'BleManagerDidUpdateValueForCharacteristic',
//         handleUpdateValueForCharacteristic,
//       );
//     };
//   }, []);

//   return (
//     <View style={styles.box}>
//       <BackButton navigator={navigator} />
//       <View style={styles.titleBox}>
//         <Text style={styles.title}>Searching...</Text>
//         <Text style={styles.description}>Trying to find your spice mixer</Text>
//       </View>
//       <AppDivider />
//       <FlatList
//         data={list}
//         renderItem={({ item }) => <Item item={item} />}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   box: {
//     marginTop: 16,
//     marginHorizontal: DIM.appMargin,
//   },
//   titleBox: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '500',
//   },
//   description: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#B6B6B6',
//     marginTop: 8,
//   },
// });

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
} from 'react-native';
import { AppDivider } from '../../common/divider/AppDivider';
import { BackButton } from '../../common/button/BackButton';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
import { DIM } from '../../common';
import { useNavigation } from '@react-navigation/native';
import { BluetoothHeader } from '../../components/bluetooth/BluetoothHeader';
import { BluetoothButton } from '../../components/bluetooth/BluetoothButton';
import { BluetoothPeripheralList } from '../../components/bluetooth/BluetoothPeripheralList';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);
  const navigator = useNavigation();

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan(['FFE0'], 3, false)
        .then((results) => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const stopScan = () => {
    if (isScanning) {
      BleManager.stopScan();
      setList([]);
    }
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setList([
      { id: '1231', name: 'Fake Spice Mixer', rssi: 16, connected: false },
      { id: '121', name: 'Fake Spice Mixer', rssi: 16, connected: false },
      { id: '131', name: 'Fake Spice Mixer', rssi: 16, connected: false },
    ]);
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  };

  const testPeripheral = (peripheral) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setList(Array.from(peripherals.values()));
            }
            console.log('Connected to ' + peripheral.id);

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                (peripheralData) => {
                  console.log('Retrieved peripheral services', peripheralData);

                  BleManager.writeWithoutResponse(
                    peripheral.id,
                    'FFE0',
                    'FFE1',
                    stringToBytes('CON'),
                  )
                    .then((data) => {
                      // Success code
                      console.log('Writed: ' + data);
                    })
                    .catch((error) => {
                      // Failure code
                      console.log(error);
                    });

                  BleManager.readRSSI(peripheral.id).then((rssi) => {
                    console.log('Retrieved actual RSSI value', rssi);
                    let p = peripherals.get(peripheral.id);
                    if (p) {
                      p.rssi = rssi;
                      peripherals.set(peripheral.id, p);
                      setList(Array.from(peripherals.values()));
                    }
                  });
                },
              );
            }, 900);
          })
          .catch((error) => {
            console.log('Connection error', error);
          });
      }
    }
  };

  useEffect(() => {
    BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );

    // if (Platform.OS === 'android' && Platform.Version >= 23) {
    //   PermissionsAndroid.check(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   ).then((result) => {
    //     if (result) {
    //       console.log('Permission is OK');
    //     } else {
    //       PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       ).then((result) => {
    //         if (result) {
    //           console.log('User accept');
    //         } else {
    //           console.log('User refuse');
    //         }
    //       });
    //     }
    //   });
    // }

    return () => {
      console.log('unmount');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);

  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => testPeripheral(item)}>
        <View style={[styles.row, { backgroundColor: color }]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {item.id}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const headerTitleAndDescription = () => {
    if (isScanning) {
      return {
        title: 'Searching...',
        description: 'Trying to find your spice mixer',
        buttonTitle: 'Cancel',
        buttonFnc: stopScan,
        middleComponent: () => <></>,
      };
    }

    if (list.length > 0) {
      return {
        title: 'Found some devices!',
        description: 'Select your spice mixer from the list below',
        buttonTitle: 'Cancel',
        middleComponent: () => <BluetoothPeripheralList list={list} />,
        buttonFnc: stopScan,
      };
    }

    return {
      title: 'Enable Bluetooth',
      description: 'Scan for your device and get connected',
      buttonTitle: 'Scan',
      middleComponent: () => <></>,
      buttonFnc: startScan,
    };
  };

  return (
    <View style={styles.box}>
      <View style={styles.headerBox}>
        <BluetoothHeader
          navigator={navigator}
          title={headerTitleAndDescription().title}
          description={headerTitleAndDescription().description}
        />
      </View>
      <View style={styles.centerBox}>
        {headerTitleAndDescription().middleComponent()}
      </View>
      <View style={styles.buttonBox}>
        <BluetoothButton
          title={headerTitleAndDescription().buttonTitle}
          onPress={() => headerTitleAndDescription().buttonFnc()}
        />
      </View>
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {global.HermesInternal == null ? null : (
          <View style={styles.engine}>
            <Text style={styles.footer}>Engine: Hermes</Text>
          </View>
        )}
        <View style={styles.body}>
          <View style={{ margin: 10 }}>
            <Button
              title="Retrieve connected peripherals"
              onPress={() => retrieveConnected()}
            />
          </View>

          {list.length === 0 && (
            <View style={{ flex: 1, margin: 20 }}>
              <Text style={{ textAlign: 'center' }}>No peripherals</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <FlatList
        data={list}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      /> */}
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
});
