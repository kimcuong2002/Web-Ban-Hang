import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reviewService = createApi({
  reducerPath: "reviews",
  tagTypes: "reviews",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.userToken;
      headers.set("authorization", token ? `Bearer ${token}` : "");
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      createReview: builder.mutation({
        query: (body) => {
          return {
            url: "/reviews",
            method: "POST",
            body,
          };
        },
      }),
      getReviews: builder.query({
        query: (data) => {
            return {
                url: `/reviews?page=${data.page}&&limit=${data.limit}&&productId=${data.productId}`,
                method: "GET"
            }
        }
      }),
    };
  },
});
export const {
  useCreateReviewMutation,
  useGetReviewsQuery,
  usePrefetch
} = reviewService;
export default reviewService;
