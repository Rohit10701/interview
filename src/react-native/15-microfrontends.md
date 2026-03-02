# 15. Micro‑frontends in React Native

Micro‑frontend architecture decomposes a single application into
discrete, independently developed modules. On mobile, this pattern is
rare but can be useful for very large teams or multi‑tenant apps.

## Basic idea

Each feature or “mini‑app” is built as a separate bundle that can be
loaded at runtime. Teams can iterate and release independently.

## Implementation strategies

### Dynamic imports

Use `import()` or `require()` with a variable path. Metro needs to be
configured with `resolver.extraNodeModules` and `serializer.getModulesRunBeforeMainModule`.

```js
// App.tsx
const Feature = React.lazy(() => import('./features/FeatureA'));
```

The bundles can be split using Metro’s `inlineRequires` and
`ram-bundle` options.

### Separate npm packages

Publish each micro‑frontend as a private package. The shell app
`npm install`s specific versions and uses a plugin registry to load
components.

### Native module loading

On iOS, use frameworks or static libraries for each module and load
JS bundles with `RCTBridge.bundleURL` pointing to different assets.
Android can load multiple `ReactInstanceManager`s with separate bundles.

## Code sharing

Common utilities and UI components should live in a shared package or
`/packages/common` workspace. Use Yarn workspaces or Lerna.

## Challenges

- **Navigation**: coordinating deep links and header styles across
  bundles; often solved by defining a common navigation API.
- **Versioning**: dependencies must align; mismatched React versions can
  crash the app.
- **Performance**: loading extra bundles increases startup time and
  memory usage. Consider lazy loading only when needed.
- **Bundling complexity**: Metro is not designed for multiple independent
  bundles out of the box. Custom packager config and manual release
  steps are required.

## Use cases

- Very large teams owned by different business units.
- White‑label or multi‑tenant apps where each tenant gets its own
  feature set.

While powerful, micro‑frontends add complexity and are rarely necessary
for most RN apps. Understand the trade‑offs before adopting the pattern.