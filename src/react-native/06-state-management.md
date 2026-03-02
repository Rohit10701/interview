# 6. State Management

State in React Native is managed the same way as in React web, but
mobile apps often require persistence, offline support, and complex
async flows.

## Local component state

Use `useState`, `useReducer`, or class component `this.setState` for
state that lives inside one screen. Keep it minimal to avoid
re-renders.

## Context API

Create a context to share values (theme, auth token) across the tree.
Remember that context updates trigger re-renders in all consumers;
memoize provider values with `useMemo`.

```tsx
const AuthContext = React.createContext<{user:User|null}>(null);
function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const value = useMemo(()=>({user,setUser}),[user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

## Redux / Redux Toolkit

- Install `@reduxjs/toolkit` and `react-redux`.
- Define `createSlice` for reducers and actions.
- Configure store with middleware like thunk or saga.
- Use hooks `useSelector` and `useDispatch`.

RTK Query simplifies data fetching with auto-generated hooks:
```ts
const api = createApi({
  baseQuery: fetchBaseQuery({baseUrl:'/api'}),
  endpoints: (builder)=>({
    getPosts: builder.query<Post[], void>({ query:()=>'posts'})
  })
});
export const {useGetPostsQuery} = api;
```

### Persistence

Use `redux-persist` with `AsyncStorage` or the faster `react-native-mmkv`.
Set up a persistConfig and wrap the store with `persistReducer`.

## Other libraries

- **MobX**: observable state, decorators.
- **Recoil**: atoms/selectors, good for complex dependency graphs.
- **Zustand**: minimal, hook-based store with immer support.

## Async patterns

- **Thunks**: simple functions returning async logic.
- **Sagas**: generator-based workflows, good for complex flows.
- **RTK Query**: declarative data layer with caching.

Choose the right tool for your team’s size and the app’s complexity.
Understand tradeoffs: boilerplate, debugging, hot reload behaviour.