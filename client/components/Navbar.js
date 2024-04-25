import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "../public/logo.png"
import styles from '../css/Navbar.module.css';
import { CgProfile } from "react-icons/cg";

const Navbar = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Image src={logo} alt="Site Logo" className={styles.logo}/>
        <Link href="/">
          <span className={styles.siteName}>Arda Aydın Kitap Öneri</span>
        </Link>
      </div>
      <div className={styles.navbarRight}>
        <div className={`${styles.menuToggle} ${isMenuOpen ? styles.close : ''}`} onClick={toggleMenu}>
          <div className={styles.menuIcon}></div>
          <div className={styles.menuIcon}></div>
          <div className={styles.menuIcon}></div>
        </div>
        <div className={`${styles.links} ${isMenuOpen ? styles.open : ''}`}>
          <Link href="/">Ana Sayfa</Link>
          <Link href="/recommend">Bana Kitap Öner</Link>
          <Link href="/trending">Çok Satanlar</Link>
          <Link href="/contact">İletişim</Link>
          {isLoggedIn ? (
            <Link href="/profile">
              <div className='flex'><CgProfile className='m-1'/>Profil</div>
            </Link>
          ) : (
            <>
              <Link href="/login">Giriş Yap</Link>
              <Link href="/register">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
