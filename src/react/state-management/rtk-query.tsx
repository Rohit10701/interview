// @ts-nocheck

// WHY: It auto-generates hooks and keeps everything in Redux DevTools.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
  }),
});

// Auto-generated hook
export const { useGetUserByIdQuery } = userApi;