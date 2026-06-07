import React from 'react';

export const View = (props: any) => React.createElement('View', props);
export const Text = (props: any) => React.createElement('Text', props);
export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios ?? obj.default,
};

export default { View, Text, Platform };
