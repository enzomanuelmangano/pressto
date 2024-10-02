import { createContext, useContext } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { makeMutable } from 'react-native-reanimated';

export const isScrolling = makeMutable(false);

const InternalScrollContext = createContext(false);

export const useScrollContext = () => {
  return useContext(InternalScrollContext);
};

export const renderScrollComponent = ({
  children,
  ...props
}: ScrollViewProps) => {
  return (
    <ScrollView
      {...props}
      onScrollBeginDrag={(event) => {
        isScrolling.value = true;
        return props.onScrollBeginDrag?.(event);
      }}
      onScrollEndDrag={(event) => {
        isScrolling.value = false;
        return props.onScrollEndDrag?.(event);
      }}
    >
      <InternalScrollContext.Provider value={true}>
        {children}
      </InternalScrollContext.Provider>
    </ScrollView>
  );
};
