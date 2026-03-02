# 4. Performance & Optimization

Mobile devices have limited CPU/GPU and slow JS bridge; performance is
critical. This crash course covers common bottlenecks and mitigation
techniques.

## Avoiding wasted work

- Wrap pure components with `React.memo` and provide a custom
  comparison function if needed.
- Memoize callbacks (`useCallback`) and derived values (`useMemo`).
- Avoid anonymous functions in render when passing to children.
- Use `PureComponent` or implement `shouldComponentUpdate`.

## Lists and virtualization

Use `FlatList`/`SectionList` for large datasets. Key props:
- `keyExtractor` returns stable string keys.
- `getItemLayout` improves scroll performance when item height is
  constant.
- `initialNumToRender`, `maxToRenderPerBatch`, `windowSize` tune
  rendering batches.

`RecyclerListView` (Flipkart) is an alternative with recycled row
views.

## Bridge and threading

- Batch JS->native calls; avoid invoking native methods on every frame.
- Heavy computation should run off the JS thread (WebWorker or native).
- Use `InteractionManager.runAfterInteractions` to defer non‑urgent work.

## Rendering optimizations

- `removeClippedSubviews` on scrollable containers to unmount off‑screen
  items.
- Avoid inline style objects in render (recreate each render).

## Hermes-specific tweaks

- Enable inline requires (`android/app/build.gradle`:
  `project.ext.react = [enableHermes: true]`).
- Pre‑bundle bytecode with `hermesc` to reduce startup time.
- Use `dbg()` in Chrome/Flipper to profile CPU and memory.

## Profiling tools

- Use Flipper’s React DevTools and performance plugin to record
  interactions and find slow renders.
- `Systrace`/`perfetto` (Android) and Instruments (iOS) for native
  thread profiling.

By routinely profiling your app and understanding where the JS thread
or UI thread is blocked, you can apply these patterns to maintain
smooth 60fps interactions.