import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useRecoilState } from 'recoil';

import { delay } from './common/utils';
import { stringToBytes } from 'convert-string';
import {
  bleConnectedPeripheral,
  bleConnectingTo,
  bleIsScanning,
  blePeripheralList,
  blePeripheralsMap,
} from './bluetooth/atoms';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BleRoot = ({ children }) => {
  const [isScanning, setIsScanning] = useRecoilState(bleIsScanning);
  const [peripherals, setPeripherals] = useRecoilState(blePeripheralsMap);
  const [connectingTo, setConnectingTo] = useRecoilState(bleConnectingTo);
  const [list, setList] = useRecoilState(blePeripheralList);
  const [connectedPeripheral, setConnectedPeripheral] = useRecoilState(
    bleConnectedPeripheral,
  );

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
    if (isScanning) {
      BleManager.stopScan();
    }
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    // setList([
    //   { id: '1231', name: 'Fake Spice Mixer', rssi: 16, connected: false },
    //   { id: '121', name: 'Fake Spice Mixer', rssi: 16, connected: false },
    //   { id: '131', name: 'Fake Spice Mixer', rssi: 16, connected: false },
    // ]);
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      if (peripheral.connected) {
        peripheral.connected = false;
        setConnectedPeripheral(undefined);
      }
      updatePeripherals(peripheral.id, peripheral);
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
        updatePeripherals(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    updatePeripherals(peripheral.id, peripheral);
    console.log(peripherals);
    setList(Array.from(peripherals.values()));
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

  useEffect(() => {
    BleManager.start({ showAlert: false });

    const listener1 = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    const listener2 = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );
    const listener3 = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    const listener4 = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );

    return () => {
      console.log('unmount');
      listener1.remove();
      listener2.remove();
      listener3.remove();
      listener4.remove();
    };
  }, []);

  return <>{children}</>;
};
