import { createRoot } from 'react-dom/client';
import '../styles/reset.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../tanstack-router/router-instance';
import { queryClient } from '../tanstack-query/query-client-instance';

export type MutationMeta = {
  /**
   * Если 'off' - глобальный обработчик ошибок пропускаем,
   * если 'on' (или нет поля) - вызываем
   */
  globalErrorHandler?: 'on' | 'off';
};

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
