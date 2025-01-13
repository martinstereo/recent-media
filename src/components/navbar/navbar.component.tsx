import styles from './navbar.module.scss';

function Navbar() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.navbarTitle}>martinstereo&apos;s recent media</h1>
      </div>
    </div>
  );
}
export default Navbar;
