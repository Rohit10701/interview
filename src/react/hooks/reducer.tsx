const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

// @ts-ignore
const [state, dispatch] = useReducer(reducer, initialState);

// @ts-ignore
<button onClick={() => dispatch({ type: 'increment' })}>+</button>