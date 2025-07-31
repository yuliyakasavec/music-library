import { Link } from '@tanstack/react-router';
import styles from '../account-bar.module.css';

import { LogoutButton } from '../logout-button';
import { useMeQuery } from '@/features/auth/api/use-me-query';

export const CurrentUser = () => {
  const query = useMeQuery();

  if (!query.data) {
    return <span>...</span>;
  }

  return (
    <div className={styles.meInfoContainer}>
      <Link to="/my-playlists" activeOptions={{ exact: true }}>
        {query.data!.login} <LogoutButton />
      </Link>
    </div>
  );
};
