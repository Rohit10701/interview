# 5. Animations

Animations improve perceived performance and engagement. React Native
provides several APIs; understanding when to use each is key.

## Animated API (built-in)

- Supports `Animated.Value`, `Animated.timing`, `spring`, `decay`,
  `sequence`, `parallel`, `stagger`.
- By default the animations run on the JS thread, but you can enable
  `useNativeDriver: true` to offload to native; only certain props
  (opacity, transform) are supported.
- Example:
  ```tsx
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue:1, duration:500, useNativeDriver:true }).start();
  }, []);
  ```

## Reanimated v2

- Works with the new JS engine (Hermes); uses worklets (JS compiled to
  native) so animations run entirely on UI thread.
- Syntax resembles normal hooks; can interpolate values and react to
  gestures without round trips.
- Example:
  ```tsx
  const progress = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(progress.value) }]
  }));
  ```

## Gesture handling

Combine with `react-native-gesture-handler` or Gesture Detector from
Reanimated. These libraries provide high‑performance, declarative
gesture recognizers that operate on the native thread.

## LayoutAnimation

- Lets you animate layout changes when components mount/unmount or
  style updates. Call `LayoutAnimation.configureNext` before state
  changes.
- Works without explicit `Animated.Value`s but is coarse-grained.

## Shared element transitions

- Libraries like `react-navigation-shared-element` animate a component
  from one screen to another seamlessly by cloning views.

## Performance tips

- Prefer native‑driver or Reanimated worklets to avoid dropped frames.
- Avoid animating layout properties (width/height) on the JS thread.
- Use `InteractionManager` to start animations after interactions finish.

Experiment with small prototypes to see differences between APIs.