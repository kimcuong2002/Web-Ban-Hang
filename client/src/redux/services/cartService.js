import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cartService = createApi({
  reducerPath: "user-carts",
  tagTypes: "carts",
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
      createCart: builder.mutation({
        query: (body) => {
          return {
            url: "/carts",
            method: "POST",
            body,
          };
        },
      }),
      updateCart: builder.mutation({
        query: (data) => {
          return {
            url: `/carts/${data.id}`,
            method: "PUT",
            body: data.body,
          };
        },
      }),
      getCartByIdUser: builder.query({
        query: (data) => {
          return {
            url: `/carts/user/${data}`,
            method: "GET",
          };
        },
      }),
      deleteCart: builder.mutation({
        query: (id) => {
          return {
            url: `/carts/${id}`,
            method: "DELETE",
          };
        },
      })
    };
  },
});
export const {
  useCreateCartMutation,
  useUpdateCartMutation,
  useGetCartByIdUserQuery,
  useDeleteCartMutation,
} = cartService;
export default cartService;
