import { Pagination } from '@/shared/ui/pagination/pagination';
import { useState } from 'react';
import { DeletePlaylist } from './playlists/delete-playlist/ui/delete-playlist';
import { usePlaylistsQuery } from '@/widgets/playlists/api/use-playlists-query';

type Props = {
  userId?: string;
  onPlaylistSelected?: (playlist: string) => void;
  onPlaylistDeleted?: (playlist: string) => void;
  isSearchActive?: boolean;
};

export const Playlists = ({
  userId,
  onPlaylistSelected,
  onPlaylistDeleted,
  isSearchActive,
}: Props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');

  const query = usePlaylistsQuery(userId, {
    search,
    pageNumber: search ? 1 : pageNumber,
  });

  //   console.log('status:' + query.status);
  //   console.log('fetchStatus:' + query.fetchStatus);

  const handleSelectPlaylistClick = (playlistId: string) => {
    onPlaylistSelected?.(playlistId);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    onPlaylistDeleted?.(playlistId);
  };

  if (query.isPending) return <span>Loading...</span>;
  if (query.isError)
    return <span>Error: {JSON.stringify(query.error.message)}</span>;
  //   if (query.fetchStatus === 'fetching') return <span>Loading...</span>;

  return (
    <div>
      {isSearchActive && (
        <>
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder={'search...'}
            />
          </div>
          <hr />{' '}
        </>
      )}
      <Pagination
        pagesCount={query.data.meta.pagesCount}
        currentPage={pageNumber}
        onPageNumberChange={setPageNumber}
        isFetching={query.isFetching}
      />
      <ul>
        {query.data.data.map((playlist) => (
          <li key={playlist.id}>
            <span onClick={() => handleSelectPlaylistClick(playlist.id)}>
              {playlist.attributes.title}
            </span>
            <DeletePlaylist
              playlistId={playlist.id}
              onDeleted={handleDeletePlaylist}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
