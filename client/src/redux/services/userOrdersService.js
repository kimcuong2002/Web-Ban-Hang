import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userOrdersService = createApi({
  reducerPath: "user-orders",
  tagTypes: "orders",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.userToken ? reducers?.authReducer?.userToken : reducers?.authReducer?.adminToken;
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
        invalidatesTags: ["user-orders"],
      }),
      updateOrder: builder.mutation({
        query: (data) => {
          return {
            url: `/orders/${data.id}`,
            method: "PATCH",
            body: data.body,
          };
        },
        invalidatesTags: ["user-orders"],
      }),
      getOrders: builder.query({
        query: (page) => {
          return {
            url: `/orders?page=${page}`,
            method: "GET",
          };
        },
        invalidatesTags: ["user-orders"],
      }),
      getOrderByIdUser: builder.query({
        query: (data) => {
          return {
            url: `/orders/user/${data}`,
            method: "GET",
          };
        },
        invalidatesTags: ["user-orders"],
      }),
      deleteOrder: builder.mutation({
        query: (id) => {
          return {
            url: `/orders/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["user-orders"],
      }),
      details: builder.query({
        query: (id) => {
          return {
            url: `/orders/${id}`,
            method: "GET",
          };
        },
        invalidatesTags: ["user-orders"],
      }),
      receivedOrder: builder.mutation({
        query: (id) => {
          return {
            url: `/orders?id=${id}&status=received`,
            method: "PUT",
          };
        },
        invalidatesTags: ["user-orders"],
      }),
      postReview: builder.mutation({
        query: (body) => {
          return {
            url: `orders/add-review`,
            method: "POST",
            body,
          };
        },
        invalidatesTags: ["user-orders"],
      }),
    };
  },
});
export const {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdUserQuery,
  useDetailsQuery,
  useDeleteOrderMutation,
  useReceivedOrderMutation,
  usePostReviewMutation,
} = userOrdersService;
export default userOrdersService;
