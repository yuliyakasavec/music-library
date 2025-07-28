import { Header } from '@/shared/ui/header/header';
import { Outlet } from '@tanstack/react-router';
import styles from './root-layout.module.css';

export const Rootlayout = () => {
  return (
    <>
      <Header renderAccountBar={() => <div>Account</div>} />
      <div className={styles.container}>
        <Outlet />
      </div>
    </>
  );
};
