import { useMeQuery } from '@/features/auth/api/use-me-query';
import { Playlists } from '@/features/playlists';
import { AddPlaylistForm } from '@/features/playlists/add-playlist/ui/add-playlist-form';
import { EditPlaylistForm } from '@/features/playlists/edit-playlist/ui/edit-playlist-form';
import { Navigate } from '@tanstack/react-router';
import { useState } from 'react';

export function MyPlaylistsPage() {
  const { data, isPending } = useMeQuery();
  const [editingPlaylistsId, setEditingPlaylistId] = useState<string | null>(
    null
  );

  const handlePlaylistsDelete = (playlistId: string) => {
    if (playlistId === editingPlaylistsId) {
      setEditingPlaylistId(null);
    }
  };

  if (isPending) return <div>Loading...</div>;

  if (!data) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h2>My playlists</h2>
      <hr />
      <AddPlaylistForm />
      <hr />
      <Playlists
        userId={data.userId}
        onPlaylistSelected={(playlistId) => setEditingPlaylistId(playlistId)}
        onPlaylistDeleted={handlePlaylistsDelete}
      />
      <hr />
      <EditPlaylistForm
        playlistId={editingPlaylistsId}
        onCancelEditing={() => setEditingPlaylistId(null)}
      />
    </div>
  );
}
