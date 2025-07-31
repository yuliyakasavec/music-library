import { client } from '@/shared/api/client';
import type { SchemaGetPlaylistOutput } from '@/shared/api/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playlistId: string) => {
      const response = await client.DELETE('/playlists/{playlistId}', {
        params: { path: { playlistId } },
      });
      return response.data;
    },
    onSuccess: (_, playlistId) => {
      queryClient.setQueriesData(
        { queryKey: ['playlists'] },
        (oldData: SchemaGetPlaylistOutput) => {
          return {
            ...oldData,
            data: oldData.data.filter((p) => p.id !== playlistId),
          };
        }
      );
      //   queryClient.invalidateQueries({
      //     queryKey: ['playlists'],
      //     refetchType: 'all',
      //   });
    },
  });
};
