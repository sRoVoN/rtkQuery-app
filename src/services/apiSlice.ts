// src/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string; 
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
  };
}

const LOCAL_STORAGE_KEY = "customUsers";

const getLocalUsers = (): User[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setLocalUsers = (users: User[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
  query: () => "users",
  transformResponse: (res: any) => {
    const apiUsers = res.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone,
      website: u.website,
      address: { street: u.address.street, city: u.address.city },
    }));

    const localUsers = getLocalUsers();

    const merged = apiUsers.map((apiUser: User) => {
  const override = localUsers.find((lu: User) => lu.id === apiUser.id);
  return override ? { ...apiUser, ...override } : apiUser;
});

const onlyLocal = localUsers.filter(
  (lu: User) => !apiUsers.find((au: User) => au.id === lu.id)
);

    return [...merged, ...onlyLocal];
  },
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: "Users" as const, id })),
          { type: "Users", id: "LIST" },
        ]
      : [{ type: "Users", id: "LIST" }],
}),
  getUser: builder.query<User | undefined, string>({
  queryFn: async (id) => {

    const localUser = getLocalUsers().find(u => u.id === id);
    if (localUser) return { data: localUser };

    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!res.ok) return { error: { status: res.status, data: await res.text() } };
    const data = await res.json();
    return {
      data: {
        id: String(data.id),
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        website: data.website,
        address: { street: data.address.street, city: data.address.city },
      },
    };
  },
  providesTags: (_result, _error, id) => [{ type: "Users", id }],
}),
    addUser: builder.mutation<User, Omit<User, "id">>({
      queryFn: async (newUser) => {
        const userWithId = { ...newUser, id: uuidv4() };
        const localUsers = getLocalUsers();
        setLocalUsers([...localUsers, userWithId]);
        return { data: userWithId };
      },
      async onQueryStarted(newUser, { dispatch, queryFulfilled }) {
        const tempId = uuidv4();
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUsers", undefined, (draft) => {
            draft.push({ id: tempId, ...newUser });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
  queryFn: async ({ id, data }) => {
    const localUsers = getLocalUsers();
    const index = localUsers.findIndex((u) => u.id === id);

    if (index !== -1) {

      localUsers[index] = { ...localUsers[index], ...data };
    } else {

      localUsers.push({ id, ...data } as User);
    }

    setLocalUsers(localUsers);
    return { data: { id, ...data } as User };
  },
  async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      userApi.util.updateQueryData("getUsers", undefined, (draft) => {
        const user = draft.find((u) => u.id === id);
        if (user) Object.assign(user, data);
      })
    );
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  },
  invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
}),
    deleteUser: builder.mutation<void, string>({
  queryFn: async (id) => {

    const localUsers = getLocalUsers();

    const filtered = localUsers.filter(u => u.id !== id);

    setLocalUsers(filtered);

    return { data: undefined };
  },
  async onQueryStarted(id, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      userApi.util.updateQueryData("getUsers", undefined, (draft) => {
        return draft.filter(u => u.id !== id);
      })
    );

    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  },
  invalidatesTags: (_result, _error, id) => [{ type: "Users", id }],
}),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi;
