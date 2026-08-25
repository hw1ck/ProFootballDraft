import React from 'react';
import styles from './TopNavBar.module.css';

export default function TopNavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        ProFootballDraft
      </div>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}><a href="#" className={styles.active}>Home</a></li>
        <li className={styles.navItem}><a href="#">Modes</a></li>
        <li className={styles.navItem}><a href="#">News</a></li>
        <li className={styles.navItem}><a href="#">Friends</a></li>
      </ul>
      <div className={styles.authLinks}>
        <button className={styles.signupBtn}>Signup</button>
      </div>
    </nav>
  );
}
