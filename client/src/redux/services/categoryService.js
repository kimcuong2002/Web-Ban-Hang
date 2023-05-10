import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const categoryService = createApi({
  reducerPath: "category",
  tagTypes: "categories",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.adminToken;
      // console.log(token);
      headers.set("authorization", token ? `Bearer ${token}` : "");
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      create: builder.mutation({
        query: (name) => {
          return {
            url: "/categories",
            method: "POST",
            body: name,
          };
        },
        invalidatesTags: ["categories"],
      }),
      updateCategory: builder.mutation({
        query: (data) => {
          return {
            url: `categories/${data.id}`,
            method: "PATCH",
            body: data.formData,
          };
        },
        invalidatesTags: ["categories"],
      }),
      deleteCategory: builder.mutation({
        query: (id) => {
          return {
            url: `categories/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["categories"],
      }),
      get: builder.query({
        query: (page) => {
          return {
            url: `categories/pages/${page}`,
            method: "GET",
          };
        },
        providesTags: ["categories"],
      }),
      fetchCategory: builder.query({
        query: (id) => {
          return {
            url: `categories/${id}`,
            method: "GET",
          };
        },
        providesTags: ["categories"],
      }),
      allCategories: builder.query({
        query: () => {
          return {
            url: "categories",
            method: "GET",
          };
        },
      }),
    };
  },
});
export const {
  useCreateMutation,
  useGetQuery,
  useFetchCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAllCategoriesQuery,
} = categoryService;
export default categoryService;
