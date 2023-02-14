import React from 'react';
import { atom } from 'recoil';

export const createIngredientState = atom({
  key: 'createIngredientState',
  default: [],
});

export const selectedIngredientState = atom({
  key: 'selectedIngredientState',
  default: {
    spiceId: '',
    name: '',
    amount: '',
  },
});
