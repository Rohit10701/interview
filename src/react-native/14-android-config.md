# 14. Android Configuration

Android apps have a rich configuration surface covered by manifests,
Gradle files, and resource directories.

## AndroidManifest.xml

Located at `android/app/src/main/AndroidManifest.xml`. Key sections:
- `<uses-permission android:name="android.permission.CAMERA" />` for
  runtime permissions.
- `<application android:label="@string/app_name" android:icon="@mipmap/ic_launcher">`
  defines activities, services, and meta‑data.
- `<activity android:name="com.facebook.react.ReactActivity" ...>`
  is the main entry point. You can add intent filters for deep links:
  ```xml
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" android:host="" />
  </intent-filter>
  ```

## Gradle build files

- `android/build.gradle` configures repositories and dependencies for
  the whole project.
- `android/app/build.gradle` contains `android { compileSdkVersion ... }`,
  `defaultConfig { applicationId, minSdkVersion, targetSdkVersion }`,
  `buildTypes { debug, release {...} }` and `signingConfigs`.
- **ProductFlavors** allow multiple variants (e.g. `free` vs `paid`).
- **Multi‑dex**: enable `multiDexEnabled true` and add
  `implementation 'com.android.support:multidex:1.0.3'` if method count
  exceeds 64K.
- **ProGuard/R8**: add rules in `proguard-rules.pro` to keep or shrink
  classes. React Native ships with default rules.

## Resources

- Store drawable assets under `res/drawable-*/` for different
  densities (`hdpi`, `xhdpi`).
- Strings go in `res/values/strings.xml`; use `<string name="app_name">MyApp</string>`.
- For localization, create additional `values-fr/strings.xml`, etc.

## Permissions & runtime

- Normal permissions are granted at install; dangerous permissions must
  be requested at runtime using `PermissionsAndroid` from JS.

## Build variants & signing

- Use `./gradlew assembleRelease` to build a signed APK if you’ve
  configured `signingConfigs`.
- `versionCode` and `versionName` in `defaultConfig` must be updated
  for each Play Store release.

## Android X / Jetifier

React Native >=0.60 uses AndroidX. If you depend on legacy libs, run
`npx jetify` after installation so that all modules are migrated.

Understanding these files lets you troubleshoot manifest mergers,
resolve dependency conflicts, and customise your app’s behavior.