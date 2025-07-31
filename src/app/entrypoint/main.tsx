import { createRoot } from 'react-dom/client';
import '../styles/reset.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '../routes/routeTree.gen.ts';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      gcTime: 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
