# 12. Touching Native Code

A mid/senior RN engineer must be comfortable jumping into the
platform projects and making changes. This section outlines common
scenarios.

## Android platform basics

- The native project lives under `android/` with Gradle build files
  (`build.gradle` at project and app levels) and `app/src/main/java`
  for source code.
- **MainActivity**: the entry point (extends `ReactActivity`).
- **AndroidManifest.xml**: declare permissions, activities, services.
- **Gradle settings**: add dependencies in `dependencies` block; use
  `implementation 'com.facebook.react:react-native:+'` or local maven.
  Configure `minSdkVersion`, `targetSdkVersion`, and `multiDexEnabled`.

### Adding a native module (Android)

1. Create `MyModule.java`:
   ```java
   public class MyModule extends ReactContextBaseJavaModule {
     public MyModule(ReactApplicationContext ctx){super(ctx);}
     @Override public String getName(){return "MyModule";}
     @ReactMethod public void toast(String msg){
       Toast.makeText(getReactApplicationContext(), msg, Toast.LENGTH_SHORT).show();
     }
   }
   ```
2. Register in a package and add to `getPackages()` in `MainApplication`.
3. Use from JS: `NativeModules.MyModule.toast('hi');`.

## iOS platform basics

- The native workspace is `ios/MyApp.xcworkspace` (CocoaPods enabled).
- `AppDelegate.m` (or `.swift`) sets up the `RCTBridge` and root view.
- `Info.plist` contains configuration entries (camera usage, URL types).
- Podfile declares native dependencies; run `pod install` after changes.

### Writing a native module (iOS)

1. Create `MyModule.h` and `MyModule.m`:
   ```objc
   #import <React/RCTBridgeModule.h>
   @interface MyModule : NSObject <RCTBridgeModule>
   @end
   // MyModule.m
   @implementation MyModule
   RCT_EXPORT_MODULE();
   RCT_EXPORT_METHOD(toast:(NSString *)message) {
     // show toast…
   }
   @end
   ```
2. Add it to the Xcode project and rebuild.
3. Access via `NativeModules.MyModule.toast('hi');`.

### Custom native UI component

Create a view manager on each platform and expose props/events. Use
`requireNativeComponent` in JS.

## Build pipeline

- JS bundles produced by Metro are embedded in native app or loaded
  from packager during development.
- Compile errors often appear in Xcode/Gradle console; read stack traces
  carefully to identify missing headers or incompatible SDK versions.

## Third-party SDKs and linking

- Use autolinking (`react-native link` for RN <0.60) or manual
  Podfile/Gradle edits for libraries without autolink support.
- Handle conflicting dependencies by using `implementation
  ('com.example:lib:1.0') {exclude group:'com.facebook'} ` or Podfile
  `:modular_headers => true`.

Knowing how to navigate these native projects, add modules, and fix
build issues is a must-have skill.