# 3. Platform APIs & Native Modules

React Native ships with high‑level JavaScript APIs for common device
features and also allows you to write custom native code.

## Built‑in JS APIs

- `Linking` – open URLs, deep links.
- `Clipboard` – read/write clipboard text.
- `PermissionsAndroid` – request runtime permissions on Android.
- `Geolocation` – deprecated; use `@react-native-community/geolocation`.
- `Vibration`, `CameraRoll`, `Dimensions`, `NetInfo`, etc.

Example permission request:
```tsx
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.CAMERA,
  {title:'Camera Permission'}
);
```

## Native modules

When no JS API exists, write a module in Java/Kotlin or Obj‑C/Swift.
Basic steps:
1. Create native class implementing `ReactContextBaseJavaModule` or
   `RCTBridgeModule`.
2. Expose methods with `@ReactMethod` (Android) or `RCT_EXPORT_METHOD`
   (iOS).
3. Register module in package/provider.
4. Import via `NativeModules.YourModule` in JS.

Example JS wrapper:
```ts
const { Calculator } = NativeModules;
Calculator.add(1,2).then(result => console.log(result));
```

## TurboModules & JSI

The new architecture replaces the bridge with synchronous C++ calls
using the JavaScript Interface (JSI). TurboModules are generated and
can expose promise or sync methods; they allow passing objects with
callbacks and eliminate JSON serialization overhead. Familiarity with
CMake, C++, and JSI bindings is useful for performance‑critical libs.

## Community packages

Most sensors/camera/etc are in `@react-native-community/*` or
`react-native-...` packages. Study their native code to learn patterns.

Knowing how to read native logs, fix build errors, and expose simple
bridge methods is expected at mid/senior level.