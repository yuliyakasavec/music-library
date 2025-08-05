import { client } from '@/shared/api/client';
import { playlistsKeys } from '@/shared/api/keys-factories/playlists-keys-factory';
import type { SchemaGetPlaylistsRequestPayload } from '@/shared/api/schema';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const usePlaylistsQuery = (
  userId: string | undefined,
  filters: Partial<SchemaGetPlaylistsRequestPayload>
) => {
  const key = userId ? playlistsKeys.myList() : playlistsKeys.list(filters);

  const queryParams = userId
    ? {
        userId,
      }
    : filters;

  const query = useQuery({
    //eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: key,
    queryFn: async ({ signal }) => {
      const response = await client.GET('/playlists', {
        params: {
          query: queryParams,
        },
        signal,
      });
      if (response.error) {
        throw (response as unknown as { error: Error }).error;
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
  return query;
};
