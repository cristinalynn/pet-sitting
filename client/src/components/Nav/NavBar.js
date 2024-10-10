import React from 'react';
import { NavLink } from "react-router-dom";
import './nav.css'

function NavBar() {
  return (
    <nav className="navbar">
        <NavLink to="/" className="navbar-link">Home</NavLink>
        
    </nav>
  )
}

export default NavBar
