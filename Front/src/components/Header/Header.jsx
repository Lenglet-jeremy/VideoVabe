import { NavLink } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.scss";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`${styles.header} d-flex flex-row align-items-center`}>
      <div className="flex-fill">
        <strong>Video Vibe</strong>
      </div>
      <div className={`${styles.headerXs} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}>
        &#9776;
      </div>
      <ul className={`${styles.headerList} ${menuOpen ? styles.show : ''}`}>
        <NavLink to={"/register"}>Register</NavLink>
        <NavLink to={"/login"}>Login</NavLink>
      </ul>
    </header>
  );
}

export default Header;
