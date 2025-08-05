import { Header } from '@/shared/ui/header/header';
import { Outlet } from '@tanstack/react-router';
import styles from './root-layout.module.css';
import { AccountBar } from '@/widgets/playlists/ui/account-bar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Rootlayout = () => {
  return (
    <>
      <Header renderAccountBar={() => <AccountBar />} />
      <div className={styles.container}>
        <Outlet />
        <ToastContainer />
      </div>
    </>
  );
};
