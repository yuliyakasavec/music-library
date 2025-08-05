import styles from './add-playlist-form.module.css';
import type { SchemaCreatePlaylistRequestPayload } from '@/shared/api/schema';
import { useAddPlaylistMutation } from '../api/use-add-playlist-mutation';
import { type JsonApiErrorDocument } from '@/shared/util/json-api-error';
import { queryErrorHandlerForRHFFactory } from '@/shared/ui/util/query-error-handler-for-rhf-factory';
import { useForm } from 'react-hook-form';

export const AddPlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SchemaCreatePlaylistRequestPayload>();

  const { mutateAsync } = useAddPlaylistMutation();

  const onSubmit = async (data: SchemaCreatePlaylistRequestPayload) => {
    try {
      await mutateAsync(data);
      reset();
    } catch (error) {
      queryErrorHandlerForRHFFactory({ setError })(
        error as unknown as JsonApiErrorDocument
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add new playlist</h2>
      <p>
        <input className={styles.inputBorder} {...register('title')} />
      </p>
      {errors.title && <p>{errors.title.message}</p>}
      <p>
        <textarea {...register('description')}></textarea>
      </p>
      {errors.description && <p>{errors.description.message}</p>}

      <button type={'submit'} className={styles.createButton}>
        Create
      </button>
      {errors.root?.server && <p>{errors.root?.server.message}</p>}
    </form>
  );
};
