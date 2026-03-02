# 10. Build & Release Basics

Preparing a React Native app for distribution involves configuring
native projects, signing, and optionally supporting over‑the‑air
updates.

## CLI choices

- **React Native CLI** gives full native control; use when you need
  custom native modules.
- **Expo** (managed or bare) simplifies build pipelines and OTA updates
  but restricts some native APIs.

## Android setup

- Edit `android/app/src/main/AndroidManifest.xml` for permissions and
  activities.
- Set `applicationId` in `android/app/build.gradle`.
- Manage resources: icons (`mipmap-xxx`), strings in `res/values`.
- Configure signing in `android/app/build.gradle`:
  ```gradle
  signingConfigs {
    release {
      storeFile file('keystore.jks')
      storePassword '***'
      keyAlias 'mykey'
      keyPassword '***'
    }
  }
  buildTypes { release { signingConfig signingConfigs.release } }
  ```
- Build a release APK/AAB:
  ```bash
  cd android && ./gradlew assembleRelease    # APK
  ./gradlew bundleRelease                    # AAB
  ```

## iOS setup

- Open `ios/MyApp.xcworkspace` in Xcode.
- Configure bundle identifier, deployment target, and team in
  project settings.
- Edit `Info.plist` keys for permissions, URL schemes, etc.
- Manage provisioning profiles and certificates (Debug vs Release).
- Archive via Xcode (`Product → Archive`) or use `xcodebuild` to
  generate an `.ipa`.

## Signing & environment

- Keep keystore/keys secure; don’t commit passwords.
- Use environment variables or CI secrets (e.g. `FASTLANE_PASSWORD`).

## Over-the-air (OTA) updates

- **CodePush** (Microsoft App Center) allows pushing JS bundles to
  devices without store releases. Integrate with `react-native-code-push`.
- **Expo Updates** for managed/bare workflow with `expo-updates`.
- Implement version-check logic to avoid breaking changes.

## Release process

1. Bump version (`version` in `package.json`, `CFBundleVersion`) and
   update changelog.
2. Run tests, build debug builds, smoke-test on devices.
3. Generate signed release artifacts and upload to Google Play or App
   Store Connect.
4. For staged rollouts, gradually increase percentage of users.

Understanding the native build pipelines and signing process is
essential for mid/senior roles; practice by doing at least one manual
release for each platform.