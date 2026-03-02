# 2. Navigation

Most RN apps need more than one screen; React Navigation is the
community standard library. This section walks through the core
concepts, setup, and common patterns.

## Getting started

Install packages:
```bash
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
# for stacks
npm install @react-navigation/stack
```
Wrap your app in a `NavigationContainer`:
```tsx
function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

## Navigators

- **StackNavigator** – push/pop screens like a call stack.
- **TabNavigator** – bottom or top tabs; can nest stacks inside.
- **DrawerNavigator** – slide‑out side menu.

Example stack:
```tsx
const Stack = createStackNavigator();
function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
```

### Passing params

```tsx
navigation.navigate('Details', {itemId:42});
// in DetailsScreen
const {itemId} = route.params;
```

## Screen options & headers

Use `options` prop or `navigation.setOptions` to customize the header
(title, back button, right icons).

## Deep linking and web

Configure a linking object with prefixes and config for path
patterns. `linking={{ prefixes:['myapp://'], config:{...} }}`.
Runs in browser via react‑navigation/web.

## Alternatives

- **React Native Navigation** (Wix) uses native view controllers.
- Roll your own with `react-native-gesture-handler` and state.

Understanding navigation is critical; practice nesting navigators,
handling hardware back button on Android, and preserving state.