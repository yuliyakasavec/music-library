import { useForm } from 'react-hook-form';
import styles from '../../add-playlist/ui/add-playlist-form.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/api/client';
import type {
  SchemaGetPlaylistsOutput,
  SchemaUpdatePlaylistRequestPayload,
} from '@/shared/api/schema';
import { useEffect } from 'react';
import { useMeQuery } from '@/features/auth/api/use-me-query';

type Props = {
  playlistId: string | null;
  clearPlaylist: () => void;
};

export const EditPlaylistForm = ({ playlistId }: Props) => {
  const { register, handleSubmit, reset } =
    useForm<SchemaUpdatePlaylistRequestPayload>();

  const { data: meData } = useMeQuery();

  useEffect(() => {
    reset();
  }, [playlistId, reset]);

  const { data, isPending, isError } = useQuery({
    queryKey: ['playlists', 'details', playlistId],
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

  const key = ['playlists', 'my', meData?.userId];

  const { mutate } = useMutation({
    mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
      const response = await client.PUT('/playlists/{playlistId}', {
        params: { path: { playlistId: playlistId! } },
        body: { ...data, tagIds: [] },
      });
      return response.data!;
    },
    onMutate: async (data: SchemaUpdatePlaylistRequestPayload) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['playlists'] });

      // Snapshot the previous value
      const previousMyPlaylists = queryClient.getQueryData(key);

      // Optimistically update to the new value
      queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
        return {
          ...oldData,
          data: oldData.data.map((p) => {
            if (p.id === playlistId)
              return {
                ...p,
                attributes: {
                  ...p.attributes,
                  description: data.description,
                  title: data.title,
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
    onError: (_, __: SchemaUpdatePlaylistRequestPayload, context) => {
      queryClient.setQueryData(key, context!.previousMyPlaylists);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists'],
        refetchType: 'all',
      });
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
        Save
      </button>
    </form>
  );
};
