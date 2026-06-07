// Tells React's act() it is running inside a test environment, silencing
// "not wrapped in act(...)" warnings from react-test-renderer.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// react-test-renderer logs a deprecation notice once per create() call under
// React 19. It is the supported renderer for this lightweight (no-RN-preset)
// setup, so filter just that message to keep CI logs readable. Any other
// console.error still surfaces.
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
