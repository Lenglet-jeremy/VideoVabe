import React from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import styles from "./App.module.scss";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className={`d-flex flex-column ${styles.appContainer}`}>
      <Header />
      <div className="d-flex flex-fill">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default App;
