import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userOrdersService = createApi({
  reducerPath: "user-orders",
  tagTypes: "orders",
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
      createOrder: builder.mutation({
        query: (body) => {
          return {
            url: "/orders",
            method: "POST",
            body,
          };
        },
      }),
      updateOrder: builder.mutation({
        query: (data) => {
          return {
            url: `/orders/${data.id}`, 
            method: "PUT", 
            body: data.body,
          }
        }
      }),
      getOrders: builder.query({
        query: (data) => {
          return {
            url: `/orders?page=${data.page}&userId=${data.userId}`,
            method: "GET",
          };
        },
        providesTags: ["orders"],
      }),
      details: builder.query({
        query: (id) => {
          return {
            url: `/orders/${id}`,
            method: "GET",
          };
        },
        providesTags: ["orders"],
      }),
      receivedOrder: builder.mutation({
        query: (id) => {
          return {
            url: `/orders?id=${id}&status=received`,
            method: "PUT",
          };
        },
        invalidatesTags: ["orders"],
      }),
      postReview: builder.mutation({
        query: (body) => {
          return {
            url: `orders/add-review`,
            method: "POST",
            body,
          };
        },
        invalidatesTags: ["orders"],
      }),
    };
  },
});
export const {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetOrdersQuery,
  useDetailsQuery,
  useReceivedOrderMutation,
  usePostReviewMutation,
} = userOrdersService;
export default userOrdersService;
