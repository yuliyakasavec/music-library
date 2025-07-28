import { MyPlaylistsPage } from '@/pages/my-playlists-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-playlists')({
  component: MyPlaylistsPage,
});
