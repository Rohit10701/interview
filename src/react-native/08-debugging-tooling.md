# 8. Debugging & Tooling

A strong RN developer is adept at using the dev tools and understanding
what happens behind the scenes.

## Metro bundler

- Launch with `npx react-native start` or it starts automatically with
  `run-android/run-ios`.
- Flags: `--reset-cache`, `--port`, `--config metro.config.js`.
- Hot reload vs fast refresh: fast refresh preserves state; hot reload
  simply re-executes JS.
- When making native changes, restart Metro (`R` in terminal).

## JavaScript debugging

- **React DevTools**: inspect component tree, props, state. Launch via
  `npx react-devtools` and connect to port 8081.
- **Chrome debugger**: press `d` in Metro and select "Debug JS Remotely";
  this runs JS in Chrome’s V8 engine (not Hermes), so only use for logic
  debugging, not performance.
- **Flipper**: a standalone desktop app by Facebook. Plugins include:
  - *React DevTools* (integrated)
  - *Hermes Debugger* (view bytecode, profile)
  - *Layout Inspector* for native views
  - *Crash Reporter*, *Network*, *Database Browser* (for AsyncStorage).

## Native debugging & logs

- iOS: Xcode → Console, add breakpoints in Swift/Obj-C. Use
  `po` to print variables.
- Android: Android Studio → Logcat; filter with your package name.
  Use `adb logcat *:S ReactNative:V ReactNativeJS:V`.
- Inspect native stack traces to locate JS‑to‑native calls.

## Profiling & performance tools

- **Systrace / Perfetto**: `npx react-native log-android` and capture
  traces to analyze UI thread frametime.
- **Flipper Performance**: record XP run, locate slow renders and
  heavy JS operations.
- **Memory**: use Instruments (Allocations, Leaks) on iOS or
  Android Profiler to watch heap.

## Misc utilities

- `react-native info` prints environment (node, watchman, Xcode,
  Android SDK versions).
- `adb shell input keyevent 82` to open dev menu on device.
- Use `console.log`, `console.warn`, `console.error` liberally; logs
  appear in Metro terminal or in device log.

Practice using these tools during development to quickly iterate and
triage bugs.