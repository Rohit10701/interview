# 11. Metro & Hermes

This section covers the two pieces of infrastructure that drive every
React Native app: the Metro JavaScript bundler and the Hermes JavaScript
engine.

## Metro Bundler

Metro is a Node.js–based bundler that understands React Native
dependencies, assets, and platform extensions. When you run
`npx react-native start`, Metro wakes up and serves a bundle to the
device.

- **Transformer**: `metro.config.js` can specify a custom transformer
  (e.g. `react-native-svg-transformer`) for non‑JavaScript assets.
- **Resolvers**: add `sourceExts`, `assetExts`, `extraNodeModules`, or
  `blacklistRE` to control module resolution.
- **Caching**: Metro caches transformed modules in `~/.metro-cache`. Use
  `--reset-cache` when moving branches or changing babel config.
- **Watch folders**: include additional directories (monorepos) via
  `watchFolders` so Metro watches them for changes.
- **Hot module reloading / fast refresh**: Metro sends updates to the
  running app without reloading the full bundle; works for functional
  components and hooks.

### Running Metro manually

```bash
cd android && ./gradlew start
# or
npx react-native start --port 8082 --reset-cache
```

## Hermes Engine

Hermes is a lightweight JS engine optimized for mobile. It offers
faster startup and lower memory usage compared to JSC.

- Enable Hermes in `android/app/build.gradle`:
  ```gradle
  project.ext.react = [enableHermes: true] // required for RN >=0.64
  ```
  and for iOS set `HermesEnabled` in `Podfile`.
- After enabling, run `pod install` and rebuild the project.
- Hermes compiles JS to bytecode ahead-of-time using `hermesc`.
  Bytecode can be pre‑bundled by setting the `jsEngine` property or via
  `gradlew hermesDebug`.
- To debug Hermes, use Flipper’s Hermes plugin or open the
  `chrome://inspect` page when running on Hermes.
- **Performance gains**: startup time is typically ~30–50% faster on
  Android; memory usage is lower because Hermes uses a compact
  garbage collector.

## JSC vs Hermes comparison

| Feature | JSC | Hermes |
|---------|-----|--------|
| Startup | slower | faster |
| Memory | higher | lower |
| JIT | yes | no (interpreted/bytecode) |
| Debugging | Chrome DevTools | Hermes Debugger/Flipper |

Hermes is now the default for new RN projects on Android; iOS support
is optional. Understanding how to enable/disable and profile both
engines is important when troubleshooting performance issues.