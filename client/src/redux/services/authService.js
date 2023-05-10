import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authService = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
  }),
  endpoints: (builder) => {
    return {
      authLogin: builder.mutation({
        query: (loginData) => {
          return {
            url: "users/login",
            method: "POST",
            body: loginData,
          };
        },
      }),
      userRegister: builder.mutation({
        query: (data) => {
          return {
            url: "users/register",
            method: "POST",
            body: data,
          };
        },
      }),
      createCustomer: builder.mutation({
        query: (data) => {
          return {
            url: "users",
            method: "POST",
            body: data,
          };
        },
      }),
      userLogin: builder.mutation({
        query: (loginData) => {
          return {
            url: "users/login",
            method: "POST",
            body: loginData,
          };
        },
      }),
      get: builder.query({
        query: (page) => {
          return {
            url: `users/pages/${page}`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),
      deleteCustomer: builder.mutation({
        query: (id) => {
          return {
            url: `users/delete/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["users"],
      }),
    };
  },
});
export const {
  useAuthLoginMutation,
  useUserRegisterMutation,
  useCreateCustomerMutation,
  useUserLoginMutation,
  useGetQuery,
  useDeleteCustomerMutation,
} = authService;
export default authService;
