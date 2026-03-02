# 1. Core Components & Styling

React Native exposes a minimal set of cross‑platform widgets that
map to the host platform’s native views. Understanding these and the
styling model is the first step toward building any app.

## Building blocks

- **View** – the generic container (similar to a `div`). Supports
  layout via Flexbox and can wrap children.
  ```tsx
  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <Text>Welcome</Text>
  </View>
  ```
- **Text** – displays text. Only text nodes or other `Text` components
  may be nested inside. Styles such as `fontSize`, `color` apply.
- **Image** – renders an image from a local asset, network URL, or data
  URI. Common props: `resizeMode`, `style`, `source={{uri:'...'}}`.
- **ScrollView** / **FlatList** / **SectionList** – scrollable
  containers. Use `FlatList` for long, performant lists with a
  `renderItem` function and `keyExtractor`.
- **TextInput** – allows keyboard input. Props include
  `keyboardType`, `onChangeText`, `secureTextEntry`.
- **TouchableOpacity** / **TouchableHighlight** / **Pressable** –
  wrappers that provide touch feedback and `onPress` handlers.

## Layout & Flexbox

RN uses Flexbox by default with `flexDirection: 'column'`.
- `justifyContent` controls main‑axis alignment, `alignItems` cross‑axis.
- Flex values distribute space; set `flex:1` to make a component fill
  available space.
- Use `Dimensions.get('window')` for screen dimensions and
  `PixelRatio.get()` to scale for density.

### Example
```tsx
const styles = StyleSheet.create({
  container: {flex:1, padding:16},
  row: {flexDirection:'row', alignItems:'center'},
});
```

## Styling

- Use `StyleSheet.create` for static styles (it freezes and assigns IDs).
- Style props are plain JS objects; you can combine them via arrays:
  `style={[styles.base, isActive && styles.active]}`.
- No cascading or inheritance; later styles override earlier ones.
- Platform‑specific: `Platform.select({ ios: {...}, android: {...} })` or
  `...Platform.OS === 'ios' && {shadowColor:'black'}`.

## Device metrics

- `Dimensions.addEventListener('change', handler)` for orientation.
- `SafeAreaView` ensures content avoids notches and home indicators.
- `StatusBar` component controls visibility and style.

## Differences from web

- No DOM API; components are translated to native widgets.
- Styles are limited to those supported by Yoga layout engine.
- No CSS selectors, global styles, or cascading; everything is
  component‑scoped.

Practising by building small screens with these components will
cement the basics.