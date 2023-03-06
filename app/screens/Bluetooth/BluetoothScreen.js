import React from 'react';
import { StyleSheet, View } from 'react-native';
import { stringToBytes } from 'convert-string';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
import { DIM } from '../../common';
import { useNavigation } from '@react-navigation/native';
import { BluetoothHeader } from '../../components/bluetooth/BluetoothHeader';
import { BluetoothButton } from '../../components/bluetooth/BluetoothButton';
import { BluetoothPeripheralList } from '../../components/bluetooth/BluetoothPeripheralList';
import { delay } from '../../common/utils';
import { BluetoothDevice } from '../../components/bluetooth/BluetoothDevice';
import { useRecoilState } from 'recoil';
import {
  bleConnectedPeripheral,
  bleConnectingTo,
  bleIsScanning,
  blePeripheralList,
  blePeripheralsMap,
} from '../../bluetooth/atoms';

export const BluetoothScreen = () => {
  const [isScanning, setIsScanning] = useRecoilState(bleIsScanning);
  const [peripherals, setPeripherals] = useRecoilState(blePeripheralsMap);
  const [connectingTo, setConnectingTo] = useRecoilState(bleConnectingTo);
  const [list, setList] = useRecoilState(blePeripheralList);
  const [connectedPeripheral, setConnectedPeripheral] = useRecoilState(
    bleConnectedPeripheral,
  );
  const navigator = useNavigation();

  const updatePeripherals = (k, v) => {
    setPeripherals(peripherals.set(k, v));
  };

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
    navigator.navigate('your-recipes-screen');
    // if (isScanning) {
    //   BleManager.stopScan();
    // }
  };

  const connectToPeripheral = async (peripheralId, peripheralName) => {
    console.log('map', peripherals);
    setConnectingTo(peripheralName);
    await delay(2000);
    try {
      await BleManager.connect(peripheralId);
      const p = peripherals.get(peripheralId);
      if (p) {
        p.connected = true;
        updatePeripherals(peripheralId, p);
        setList(Array.from(peripherals.values()));
        setConnectedPeripheral(p);
        console.log('we have made it here');
      }
      console.log('Connected to ' + peripheralId);
    } catch (err) {
      console.log('Connection error:', err);
    }
    setConnectingTo();
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
              updatePeripherals(peripheral.id, p);
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
                      updatePeripherals(peripheral.id, p);
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

  const headerTitleAndDescription = () => {
    if (connectedPeripheral) {
      return {
        title: 'Connected!',
        description: 'You are good to go!',
        buttonTitle: 'Download spice blends',
        secondaryButtonTitle: 'Configure SpiceMixer',
        secondaryButtonFnc: () => navigator.navigate('configure-device-screen'),
        buttonFnc: () => navigator.navigate('your-recipes-screen'),
        middleComponent: () => (
          <BluetoothDevice name={connectedPeripheral.name} />
        ),
      };
    }

    if (connectingTo) {
      return {
        title: 'Connecting...',
        description: 'Trying to connect to your spice mixer',
        buttonTitle: 'Cancel',
        buttonFnc: stopScan,
        middleComponent: () => <BluetoothDevice name={connectingTo} />,
      };
    }

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
        middleComponent: () => (
          <BluetoothPeripheralList list={list} connect={connectToPeripheral} />
        ),
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
        {headerTitleAndDescription().secondaryButtonTitle && (
          <BluetoothButton
            title={headerTitleAndDescription().secondaryButtonTitle}
            onPress={() => headerTitleAndDescription().secondaryButtonFnc()}
          />
        )}
        <BluetoothButton
          title={headerTitleAndDescription().buttonTitle}
          onPress={() => headerTitleAndDescription().buttonFnc()}
          primary={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    flex: 3,
  },
  centerBox: {
    flex: 10,
  },
  buttonBox: {
    flex: 2,
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
