import React from 'react';
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import './nav.css'

function NavBar() { 
    // Get owner from Redux store
    const owner = useSelector(state => state.owner.owner);

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-link">Home</NavLink>
            
            {owner && <NavLink to="/pets" className="navbar-link">Add Pet</NavLink>}
            {owner && <NavLink to="/editpets" className="navbar-link">Edit Pet</NavLink>}
            {owner ? (
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
