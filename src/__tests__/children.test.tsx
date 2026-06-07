import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { PressableScale } from '../pressables/custom/scale';

describe('children render prop', () => {
  it('calls children function with animation params', () => {
    const childrenFn = jest.fn(() => null);
    render(<PressableScale>{childrenFn}</PressableScale>);
    expect(childrenFn).toHaveBeenCalledWith(
      expect.objectContaining({
        progress: expect.anything(),
        isPressed: expect.anything(),
        isToggled: expect.anything(),
        isSelected: expect.anything(),
        withAnimation: expect.any(Function),
      })
    );
  });

  it('renders the node returned by the children function', () => {
    render(
      <PressableScale>
        {() => <Text testID="render-prop-child">hi</Text>}
      </PressableScale>
    );
    expect(screen.getByTestId('render-prop-child')).toBeTruthy();
  });

  it('renders static children when not a function', () => {
    render(
      <PressableScale>
        <Text testID="static-child">hi</Text>
      </PressableScale>
    );
    expect(screen.getByTestId('static-child')).toBeTruthy();
  });

  it('exposes a worklet-safe withAnimation that returns its value', () => {
    let result: number | undefined;
    render(
      <PressableScale>
        {({ withAnimation }) => {
          result = withAnimation(42);
          return null;
        }}
      </PressableScale>
    );
    expect(result).toBe(42);
  });
});
