import React from 'react';

export const View = (props: any) => React.createElement('View', props);
export const Text = (props: any) => React.createElement('Text', props);
export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios ?? obj.default,
};

const flatten = (style: any): any => {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    return style.reduce(
      (acc: any, s: any) => Object.assign(acc, flatten(s) ?? {}),
      {}
    );
  }
  return style;
};

export const StyleSheet = {
  flatten,
  create: (styles: any) => styles,
  absoluteFill: {},
  hairlineWidth: 1,
};

export default { View, Text, Platform, StyleSheet };
