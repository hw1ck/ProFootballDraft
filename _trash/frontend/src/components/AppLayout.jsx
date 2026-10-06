import React from 'react';
import TopNavBar from './TopNavBar/TopNavBar';
import HomeDashboard from '../pages/HomeDashboard/HomeDashboard';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.appLayout}>
      <TopNavBar />
      <main className={styles.mainContent}>
        <HomeDashboard />
      </main>
    </div>
  );
}
