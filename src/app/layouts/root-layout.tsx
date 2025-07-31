import { Header } from '@/shared/ui/header/header';
import { Outlet } from '@tanstack/react-router';
import styles from './root-layout.module.css';
import { AccountBar } from '@/widgets/playlists/ui/account-bar';

export const Rootlayout = () => {
  return (
    <>
      <Header renderAccountBar={() => <AccountBar />} />
      <div className={styles.container}>
        <Outlet />
      </div>
    </>
  );
};
