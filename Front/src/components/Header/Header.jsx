import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import styles from "./Header.module.scss";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <header className={`${styles.header} d-flex flex-row align-items-center`}>
      <div className="flex-fill">
        <strong>Video Vibe</strong>
      </div>
      <div className={`${styles.headerXs} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}>
        &#9776;
      </div>
      <ul className={`${styles.headerList} ${menuOpen ? styles.show : ''}`}>
        
      {isAuthenticated ? (
              <NavLink to="/login">Logout</NavLink>
          ) : (
            <>
              <NavLink to={"/register"}>Register</NavLink>
              <NavLink to={"/login"}>Login</NavLink>
            </>
          )}
      </ul>
    </header>
  );
}

export default Header;
