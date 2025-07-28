import { OAuthCallbackPage } from '@/pages/auth/oauth-callback-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallbackPage,
});
