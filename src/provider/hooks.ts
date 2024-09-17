import { useContext } from 'react';
import { PressablesContext } from './context';

export const usePressablesConfig = () => {
  return useContext(PressablesContext);
};
