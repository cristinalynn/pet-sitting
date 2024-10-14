import React from 'react';
import { NavLink } from "react-router-dom";
import './nav.css'

function NavBar({ isLoggedIn }) { 
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-link">Home</NavLink>
            {isLoggedIn && <NavLink to="/pets" className="navbar-link">Add Pet</NavLink>}
            {isLoggedIn ? (
                <NavLink to="/owner" className="navbar-link">Profile</NavLink>
            ) : (
                <React.Fragment>
                    <NavLink to="/signup" className="navbar-link">Sign Up</NavLink>
                    <NavLink to="/login" className="navbar-link">Login</NavLink>
                </React.Fragment>
            )}
        </nav>
    );
}

export default NavBar
