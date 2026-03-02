# 13. iOS Configuration

When customizing or releasing an iOS app, you deal with several
configuration files and build settings.

## Info.plist

This XML file contains metadata used by the system. Common keys:
- `CFBundleDisplayName` – app name shown on home screen.
- `CFBundleIdentifier` – bundle ID (reverse domain style).
- `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription` –
  strings shown when requesting permissions.
- `LSApplicationQueriesSchemes` – allowed URL schemes for `canOpenURL`.
- `UIBackgroundModes` – e.g., `audio`, `location`, `fetch`.

Example:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photos.</string>
```

## AppDelegate

`AppDelegate.m`/`.swift` responds to lifecycle events (`application:didFinishLaunchingWithOptions:`)
and handles URL opens, notifications, deep links. Add bridging code
for any native SDKs here (e.g., Firebase, Facebook).

## Pods & frameworks

- Manage native dependencies via CocoaPods. Example Podfile for RN:
  ```ruby
  platform :ios, '13.0'
  require_relative '../node_modules/react-native/scripts/react_native_pods'

  target 'MyApp' do
    config = use_native_modules!
    use_frameworks!
    use_react_native!(:path => config[:reactNativePath])
    pod 'Firebase/Analytics'
  end
  ```
- Run `pod install` after editing.
- Add custom pods or subspecs for third‑party SDKs.

## Build settings

- **Bitcode** – can be enabled or disabled per target; required for
  WatchOS but optional for RN (deprecated by Apple).
- **Entitlements** – `*.entitlements` file configures capabilities like
  Push Notifications, App Groups, Keychain sharing.
- **Provisioning profiles** and **signing**: set in Xcode’s Signing
  & Capabilities tab or use `fastlane match` to manage.

## Other considerations

- **LaunchScreen.storyboard** and assets for splash screens.
- App icons and launch images managed via `Images.xcassets`.
- Localization: use `InfoPlist.strings` for localized permission texts
  and `Localizable.strings` for in‑app text.

Knowing these files and where to adjust them is critical when adding
new native features, configuring push, or preparing a release build.