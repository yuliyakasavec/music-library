import { useForm } from 'react-hook-form';
import styles from './add-playlist-form.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/api/client';
import type { SchemaCreatePlaylistRequestPayload } from '@/shared/api/schema';

export const AddPlaylistForm = () => {
  const { register, handleSubmit } =
    useForm<SchemaCreatePlaylistRequestPayload>();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
      const response = await client.POST('/playlists', {
        body: data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists'],
        refetchType: 'all',
      });
    },
  });

  const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add new playlist</h2>
      <p>
        <input className={styles.inputBorder} {...register('title')} />
      </p>
      <p>
        <textarea {...register('description')}></textarea>
      </p>
      <button type={'submit'} className={styles.createButton}>
        Create
      </button>
    </form>
  );
};
