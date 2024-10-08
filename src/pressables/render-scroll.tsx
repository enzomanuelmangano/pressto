import { createContext, forwardRef, useContext } from 'react';
import type { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { makeMutable } from 'react-native-reanimated';

export const scrollableInfoShared = makeMutable({
  activatedTap: false,
  isScrolling: false,
});

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

let timeout: NodeJS.Timeout | null = null;

const callbacks = {
  onTouchStart: () => {
    scrollableInfoShared.value = {
      ...scrollableInfoShared.value,
      activatedTap: false,
    };
    timeout = setTimeout(() => {
      scrollableInfoShared.value = {
        ...scrollableInfoShared.value,
        activatedTap: true,
      };
    }, 75);
  },
  onScrollBeginDrag: () => {
    if (timeout != null) {
      clearTimeout(timeout);
    }
    scrollableInfoShared.value = {
      ...scrollableInfoShared.value,
      isScrolling: true,
    };
  },
  onScrollEndDrag: () => {
    scrollableInfoShared.value = {
      ...scrollableInfoShared.value,
      isScrolling: false,
    };
  },
  onTouchEnd: () => {
    if (timeout != null) {
      clearTimeout(timeout);
    }
    scrollableInfoShared.value = {
      ...scrollableInfoShared.value,
      activatedTap: false,
    };
  },
};

export const renderScrollComponent = ({
  children,
  ...props
}: ScrollViewProps) => {
  return (
    <InternalScrollView
      {...props}
      onTouchStart={callbacks.onTouchStart}
      onScrollBeginDrag={callbacks.onScrollBeginDrag}
      onScrollEndDrag={callbacks.onScrollEndDrag}
      onTouchEnd={callbacks.onTouchEnd}
    >
      {children}
    </InternalScrollView>
  );
};
