import React from 'react';
import TopNavBar from './TopNavBar/TopNavBar';
import TopStatusBar from './TopStatusBar/TopStatusBar';
import HomeDashboard from '../pages/HomeDashboard/HomeDashboard';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.appLayout}>
      <TopStatusBar />
      <TopNavBar />
      <main className={styles.mainContent}>
        <HomeDashboard />
      </main>
    </div>
  );
}
