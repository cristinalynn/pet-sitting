import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import './owner.css';

function Profile({ onLogout }) {
  const [owner, setOwner] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the current owner's data on component mount
  useEffect(() => {
    fetchCurrentOwner();
  }, []);

  const fetchCurrentOwner = async () => {
    try {
      const response = await fetch('/api/check_session');
      if (response.ok) {
        const ownerData = await response.json();
        setOwner(ownerData);
      } else {
        console.error('Failed to fetch current owner');
      }
    } catch (error) {
      console.error('Error fetching current owner:', error);
    }
  };

  const handleSaveProfile = async (values) => {
    try {
      const response = await fetch(`/api/current_owner/${owner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedOwner = await response.json();
        setOwner(updatedOwner);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        setOwner(null);
        onLogout();
        navigate('/');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="profile">
      <h1>Hello {owner ? owner.name : ''}!</h1>
      {owner && (
        <>
          <Formik
            initialValues={{ name: owner.name || '' }}
            onSubmit={(values, actions) => {
              handleSaveProfile(values);
              actions.setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form className="box" onSubmit={handleSubmit}>
                <p className="profile-email">Email: {owner.email}</p>
                <div className="input-box">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>

                <button className="button" type="submit" disabled={isSubmitting}>
                  Save
                </button>

                <h2>Your Pets</h2>
                {owner.pets && owner.pets.length > 0 ? (
                  <ul>
                    {owner.pets.map((pet) => (
                      <li key={pet.id}>
                        {pet.name} - {pet.breed}, Age: {pet.age}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>You have no pets added yet.</p>
                )}
              </form>
            )}
          </Formik>

          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="button-logout">
            <button className="button-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;