import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const reviewService = createApi({
  reducerPath: 'reviews',
  tagTypes: 'reviews',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.userToken;
      headers.set('authorization', token ? `Bearer ${token}` : '');
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      createReview: builder.mutation({
        query: (body) => {
          return {
            url: '/reviews',
            method: 'POST',
            body,
          };
        },
        validatesTags: ["reviews"]
      }),
      getReviews: builder.query({
        query: (data) =>
          `/reviews?page=${data.page}&&limit=${data.limit}&&productId=${data.productId}`,
          providesTags: ["reviews"]
      }),
    };
  },
});
export const { useCreateReviewMutation, useGetReviewsQuery } =
  reviewService;
export default reviewService;
