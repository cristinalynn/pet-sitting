import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SignupForm from "./Owner/SignupForm";
import NavBar from "./Nav/NavBar";
import Login from "./Owner/Login";
import Profile from "./Owner/Profile";
import PetForm from "./Pets/PetForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Resets isLoggedIn state to false when logging out
    setIsLoggedIn(false); 
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/recipes" element={<Recipes />} /> */}
        {/* <Route path="/savedrecipes" element={<SavedRecipes />} /> */}
        <Route path="/pets" element={<PetForm />} />
        <Route
          path="/signup"
          element={<SignupForm onSignUpSuccess={handleLogin} />}
        />
        <Route 
          path="/login" 
          element={<Login 
          onLoginSuccess={() => setIsLoggedIn(true)} />} />

        <Route path="/owner" element={<Profile onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

  
export default App;
