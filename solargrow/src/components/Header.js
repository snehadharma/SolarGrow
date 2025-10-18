import React from "react";
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png"; 
// import styles from './Header.module.css';
import '../App.css';

function Header () {	
  const location = useLocation();
    return (
      <div className={styles.header}>
        <img className={styles.logo} src={logo} alt="star" />
        
        <Link to="/Home" className={styles.trailblazer}>trailblazer</Link>

        <div className = {styles.container}>
        <Link 
          to="/Home" 
          className={`${styles.home} ${location.pathname === "/Home" ? styles.active : ""}`}
        >
          home
        </Link>
        <Link 
          to="/LogIn" 
          className={`${styles.logIn} ${location.pathname === "/LogIn" ? styles.active : ""}`}
        >
          log in
        </Link>
        <Link 
          to="/SignUp" 
          className={`${styles.signUp} ${location.pathname === "/SignUp" ? styles.active : ""}`}
        >
          sign up
        </Link>
        </div>

      </div>)
            
};

export default Header;
