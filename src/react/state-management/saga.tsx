// @ts-nocheck

// WHY: For complex flows like "Try 3 times, wait 5 seconds between, then alert admin."
import { takeLatest, call, put, delay } from 'redux-saga/effects';

function* retryWebhookSaga(action) {
  for (let i = 0; i < 3; i++) {
    try {
      yield call(api.sendWebhook, action.payload);
      yield put({ type: 'WEBHOOK_SUCCESS' });
      return; // Exit if success
    } catch (e) {
      if (i < 2) yield delay(5000); // Wait 5s before next attempt
    }
  }
  yield put({ type: 'WEBHOOK_FAILED_PERMANENTLY' });
}

export default function* rootSaga() {
  yield takeLatest('RETRY_WEBHOOK_REQUEST', retryWebhookSaga);
}