import { useContext } from 'react';
import { PressablesContext, PressablesGroupContext } from './context';

export const usePressablesConfig = () => {
  return useContext(PressablesContext);
};

export const useLastTouchedPressable = () => {
  return useContext(PressablesGroupContext).lastTouchedPressable;
};
