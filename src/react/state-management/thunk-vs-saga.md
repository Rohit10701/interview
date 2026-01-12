### The Middleware: Thunk vs. Saga
These are used within Redux to handle asynchronous tasks (like API calls or webhooks).

#### Redux Thunk (The Default)
A "Thunk" is just a function that returns another function. It is built into RTK by default.

Use Case: 90% of your needs. Simple fetch calls or basic "if-this-then-that" logic.

Example: Fetching a user profile when a button is clicked.

#### Redux Saga (The Powerhouse)
Saga uses ES6 Generators (function*) to manage side effects. It acts like a separate thread in your app that listens for actions and "orchestrates" them.


Use Case: Highly complex flows. If you need to handle cancellation (stop an API call if the user navigates away), polling, retries (perfect for your interest in webhook reliability), or complex race conditions.


Example: A real-time stock ticker that needs to pause when the tab is hidden and resume with a retry-logic if the connection drops.



<!-- Example -->
Imagine you are building a feature for your project Rebound where a user clicks "Verify Webhook." This requires checking the local store first, then calling the API, then updating the store.

#### The Thunk Way (Imperative)
It looks like a standard async/await function.

```typescript
// WHY: Easy to read, logic is all in one place.
export const verifyWebhook = (webhookId) => async (dispatch, getState) => {
  const { webhooks } = getState();
  
  // 1. Check if already verified in local state
  if (webhooks.items[webhookId].status === 'verified') return;

  dispatch(verifyStarted());

  try {
    // 2. Async API call
    const response = await api.post(`/verify/${webhookId}`);
    
    // 3. Dispatch result
    dispatch(verifySuccess(response.data));
  } catch (error) {
    dispatch(verifyFailed(error.message));
  }
};
```

#### The Saga Way (Declarative)
It looks like a background worker listening for a "Signal."

```typescript
// WHY: Perfect if you need to "cancel" the verification if the user clicks "Cancel"
function* verifyWebhookSaga(action) {
  try {
    const response = yield call(api.post, `/verify/${action.payload.id}`);
    yield put({ type: 'VERIFY_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'VERIFY_FAILED', error });
  }
}

// The "Watcher"
export function* watchVerify() {
  yield takeLatest('VERIFY_REQUESTED', verifyWebhookSaga);
}
```


- Use Thunk if: You need to dispatch multiple actions in a specific order based on the current Redux state. For example: "If the user is logged in AND the webhook is unverified, then start the loading spinner and fetch data."

- Use Saga if: You need high-level control, like debouncing (waiting for the user to stop typing before searching) or retries with exponential backoff (very useful for your webhook-as-a-service interest).

- Use RTK Query (Instead of both): If you just want to get data from your Go backend and show it on the screen. 90% of your Thunks/Sagas should probably be RTK Query now.