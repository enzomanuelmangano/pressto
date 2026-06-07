// Tells React's act() it is running inside a test environment, silencing
// "not wrapped in act(...)" warnings from react-test-renderer.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
