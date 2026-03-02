# 7. TypeScript in React Native

TypeScript adds type safety to your RN apps. The ecosystem supports it
well but there are some mobile‑specific considerations (native modules,
navigation params, Metro config).

## Basic setup

- Create a fresh project:
  ```bash
  npx react-native init MyApp --template react-native-template-typescript
  ```
  or add to an existing repo:
  ```bash
  yarn add -D typescript @types/react @types/react-native
  touch tsconfig.json
  ```
- Typical `tsconfig.json`:
  ```json
  {
    "extends": "@tsconfig/react-native/tsconfig.json",
    "compilerOptions": {
      "jsx": "react-native",
      "allowJs": true,
      "noEmit": true,
      "skipLibCheck": true
    },
    "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
  }
  ```
- Babel and Metro work with `.ts`/`.tsx` automatically; no extra
  transformer is required.

## Typing components and navigation

```tsx
interface Props {title: string; onPress: () => void;}
const Button: React.FC<Props> = ({title,onPress}) => (
  <TouchableOpacity onPress={onPress}><Text>{title}</Text></TouchableOpacity>
);
```

For React Navigation, define a param list:
```ts
type RootStackParamList = { Home: undefined; Details: {id: number}};
const Stack = createStackNavigator<RootStackParamList>();
function HomeScreen({navigation}: StackScreenProps<RootStackParamList,'Home'>) {
  navigation.navigate('Details',{id:42});
}
```

## Native modules & bridge interfaces

Augment the `NativeModules` interface with custom types:
```ts
declare module 'react-native' {
  interface NativeModulesStatic {
    MyModule: {add(a:number,b:number): Promise<number>};
  }
}
```
Then use `NativeModules.MyModule.add(1,2)` safely.

For TurboModules, generate `.h`/`.js` bindings or use codegen.

## Metro & Babel config

Ensure `ts`/`tsx` extensions are listed in `metro.config.js`:
```js
module.exports = {
  resolver: {sourceExts: ['ts','tsx','js','jsx','json']}
};
```

## Common pitfalls

- Forgetting to restart Metro after adding new file extensions.
- Mismatched React Navigation types causing `any` falling through.
- Using `require` with non‑JS assets may need `@types/jest` or a
  custom declaration (`declare module '*.png';`).

Once set up, most flow from React web carries over; refer to
`@types/react-native` for platform‑specific APIs.
