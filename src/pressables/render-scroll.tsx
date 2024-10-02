import { createContext, forwardRef, useContext } from 'react';
import type { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { makeMutable } from 'react-native-reanimated';

export const isScrolling = makeMutable(false);

const InternalScrollableContext = createContext(false);

export const useIsInInternalScrollContext = () => {
  return useContext(InternalScrollableContext);
};

const InternalScrollView = forwardRef<ScrollView, ScrollViewProps>(
  (props, ref) => {
    return (
      <InternalScrollableContext.Provider value={true}>
        <ScrollView {...(props as any)} ref={ref} />
      </InternalScrollableContext.Provider>
    );
  }
);

export const renderScrollComponent = ({
  children,
  ...props
}: ScrollViewProps) => {
  return (
    <InternalScrollView
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
      {children}
    </InternalScrollView>
  );
};
