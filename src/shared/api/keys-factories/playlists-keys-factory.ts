import type { SchemaGetPlaylistsRequestPayload } from '../schema';

/* eslint-disable */
/* prettier-ignore */
export const playlistsKeys = {
  all: ['playlists'],
   lists: () => [...playlistsKeys.all, 'lists'],
    myList: () => [...playlistsKeys.lists(), 'my'],
    list: (filters: Partial<SchemaGetPlaylistsRequestPayload>) => [
    ...playlistsKeys.lists(),
    filters,
  ],
   details: () => [...playlistsKeys.all, 'details'],
    detail: (id: string) => [...playlistsKeys.details(), id]
};
