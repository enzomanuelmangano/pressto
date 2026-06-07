// Marks this as a React act() environment, silencing "not wrapped in act(...)".
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// React 19 deprecated `react-test-renderer`, which logs a notice on every
// render. This is NOT our usage to fix: @testing-library/react-native (the
// supported RN testing tool) still depends on and renders through
// react-test-renderer internally (see its act.js / render-act.js), so the
// notice fires regardless of which API we call. Until RNTL migrates off it
// there is no way to remove the warning — so we filter only this one exact
// message to keep CI logs readable. Every other console.error still surfaces.
const originalConsoleError = console.error;
jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('react-test-renderer is deprecated')
  ) {
    return;
  }
  originalConsoleError(...args);
});
export {};
