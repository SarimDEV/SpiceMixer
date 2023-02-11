import React from 'react';
import { atom } from 'recoil';

export const authDisplayName = atom({
  key: 'authDisplayName',
  default: '',
});
