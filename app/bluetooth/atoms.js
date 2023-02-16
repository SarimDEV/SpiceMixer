import { atom } from 'recoil';

export const bleConnectedPeripheral = atom({
  key: 'ble-connected-device',
  default: undefined,
});

export const blePeripheralList = atom({
  key: 'ble-peripheral-list',
  default: [],
});

export const bleConnectingTo = atom({
  key: 'ble-connecting-to',
  default: '',
});

export const bleIsScanning = atom({
  key: 'ble-is-scanning',
  default: false,
});

export const blePeripheralsMap = atom({
  key: 'ble-peripherals-map',
  default: new Map(),
});
