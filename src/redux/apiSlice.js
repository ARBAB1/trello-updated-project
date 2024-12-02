import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // Optional: Name for the state slice
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://13j4t1np-6000.inc1.devtunnels.ms', // Base URL for API
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('accesstoken', `Bearer ${token}`);
        headers.set('x-api-key', 'TrelloAPIkey$$%');
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllWorkspaces: builder.query({
      query: () => '/workspace/get-all-workspaces',
    }),
    getWorkspaceTypes: builder.query({
      query: () => '/workspace/get-workspace-types',
    }),
    createWorkspace: builder.mutation({
      query: (workspace) => ({
        url: '/workspace/create-workspace',
        method: 'POST',
        body: workspace,
      }),
    }),
    getWorkspaceMembers: builder.query({
      query: (workspaceId) => `/workspace/get-workspace-members-by-workspace-id/${workspaceId}`,
    }),
    sendEmailInvitation: builder.mutation({
      query: (invitation) => ({
        url: '/workspace/send-email-invitation',
        method: 'POST',
        body: invitation,
      }),
    }),
    removeWorkspaceMember: builder.mutation({
      query: ({ workspaceId, userId }) => ({
        url: '/workspace/remove-member-from-workspace',
        method: 'POST',
        body: { workspace_id: workspaceId, user_id: userId },
      }),
    }),
  }),
});

export const {
  useGetAllWorkspacesQuery,
  useGetWorkspaceTypesQuery,
  useCreateWorkspaceMutation,
  useGetWorkspaceMembersQuery,
  useSendEmailInvitationMutation,
  useRemoveWorkspaceMemberMutation,
} = apiSlice;
