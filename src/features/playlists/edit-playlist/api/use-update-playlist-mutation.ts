import { client } from '@/shared/api/client';
import { playlistsKeys } from '@/shared/api/keys-factories/playlists-keys-factory';
import type {
  SchemaGetPlaylistsOutput,
  SchemaUpdatePlaylistRequestPayload,
} from '@/shared/api/schema';
import type { JsonApiErrorDocument } from '@/shared/util/json-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type MutationVariables = SchemaUpdatePlaylistRequestPayload & {
  playlistId: string;
};

export const useUpdatePlaylistMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: JsonApiErrorDocument) => void;
}) => {
  const queryClient = useQueryClient();

  const key = playlistsKeys.myList();

  return useMutation({
    mutationFn: async (variables: MutationVariables) => {
      const { playlistId, ...rest } = variables;
      const response = await client.PUT('/playlists/{playlistId}', {
        params: { path: { playlistId: playlistId } },
        body: { ...rest, tagIds: [] },
      });
      return response.data!;
    },
    onMutate: async (variables: MutationVariables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: playlistsKeys.all });

      // Snapshot the previous value
      const previousMyPlaylists = queryClient.getQueryData(key);

      // Optimistically update to the new value
      queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
        return {
          ...oldData,
          data: oldData.data.map((p) => {
            if (p.id === variables.playlistId)
              return {
                ...p,
                attributes: {
                  ...p.attributes,
                  description: variables.description,
                  title: variables.title,
                },
              };
            else return p;
          }),
        };
      });

      // Return a context object with the snapshotted value
      return { previousMyPlaylists };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (error, __: MutationVariables, context) => {
      queryClient.setQueryData(key, context!.previousMyPlaylists);
      onError?.(error as unknown as JsonApiErrorDocument);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    // Always refetch after error or success:
    onSettled: (_, __, variables: MutationVariables) => {
      queryClient.invalidateQueries({
        queryKey: playlistsKeys.lists(),
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: playlistsKeys.detail(variables.playlistId),
        refetchType: 'all',
      });
    },
  });
};
