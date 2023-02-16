import React from 'react';
import { atom } from 'recoil';

export const configureSpices = atom({
  key: 'configureSpices',
  default: [
    {
        spiceId: '',
        name: ''
    },
    {
        spiceId: '',
        name: ''
    },
    {
        spiceId: '',
        name: ''
    }
  ],
});
