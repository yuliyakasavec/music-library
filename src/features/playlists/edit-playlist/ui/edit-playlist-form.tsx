import { useForm } from 'react-hook-form';
import styles from '../../add-playlist/ui/add-playlist-form.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/api/client';
import type { SchemaUpdatePlaylistRequestPayload } from '@/shared/api/schema';
import { useEffect } from 'react';

type Props = {
  playlistId: string | null;
  clearPlaylist: () => void;
};

export const EditPlaylistForm = ({ playlistId, clearPlaylist }: Props) => {
  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>();

  useEffect(() => {
    reset();
  }, [playlistId, reset]);

  const { data, isPending, isError } = useQuery({
    queryKey: ['playlists', playlistId],
    queryFn: async () => {
      const response = await client.GET('/playlists/{playlistId}', {
        params: { path: { playlistId: playlistId! } },
      });
      console.log(playlistId);
      return response.data!;
    },
    enabled: !!playlistId,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
      const response = await client.PUT('/playlists/{playlistId}', {
        params: { path: { playlistId: playlistId! } },
        body: { ...data, tagIds: [] },
      });
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists'],
        refetchType: 'all',
      });
      clearPlaylist();
    },
  });

  const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
    mutate(data);
  };

  if (!playlistId) return <></>;
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Some error</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <p>
        <input
          className={styles.inputBorder}
          {...register('title')}
          defaultValue={data.data.attributes.title}
        />
      </p>
      <p>
        <textarea
          {...register('description')}
          defaultValue={data.data.attributes.description!}
        ></textarea>
      </p>
      <button type={'submit'} className={styles.createButton}>
        Create
      </button>
    </form>
  );
};
