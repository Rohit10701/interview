# 9. Testing

Testing React Native apps involves unit/integration tests, UI
snapshots, and end‑to‑end flows.

## Unit & component tests

- Use **Jest** (bundled in RN projects) with `react-native-testing-library`.
- Configure `jest.config.js`:
  ```js
  module.exports = {
    preset: 'react-native',
    setupFiles: ['./jest/setup.js'],
    transformIgnorePatterns: ['node_modules/(?!(react-native|my-lib)/)'],
  };
  ```
- Example test:
  ```tsx
  import {render, fireEvent} from '@testing-library/react-native';
  it('calls onPress', ()=>{
    const onPress=jest.fn();
    const {getByText}=render(<Button onPress={onPress} title="go"/>);
    fireEvent.press(getByText('go'));
    expect(onPress).toHaveBeenCalled();
  });
  ```
- **Snapshot tests** capture the rendered output. Run `jest -u` to
  update.
- **Mocking native modules**: in `jest/setup.js`:
  ```js
  jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
  ```
  or provide manual mocks under `__mocks__/`.

## E2E testing

- **Detox** is the popular choice for greybox testing on iOS/Android.
  Install and configure `detoxrc.json`, define build and test
  commands, and write tests with a jest-like API.
- **Appium** or **Cypress** (with Appium plugin) are alternatives.
- E2E tests run on simulators or real devices in CI. Set up fuzzing for
  gestures, input, and navigation flows.

## CI integration

- On GitHub Actions/Bitrise/CircleCI, build the app and run Jest and
  Detox as separate workflows. Cache `~/.gradle` and `Pods` for speed.
- Use fastlane or custom scripts to automate building test apps.

Good tests give you confidence to refactor and catch regressions early.