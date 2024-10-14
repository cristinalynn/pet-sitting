import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Formik } from 'formik';
import './owner.css'

function Profile({onLogout}) {
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate(); 

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
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
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        setOwner(null);
        onLogout();
        // HOME PAGE AFTER LOGGING OUT
        navigate('/'); 
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className='profile'>
    <h1>Hello {owner ? owner.name : ''}!</h1>
      {owner ? (
        <>
          <Formik
            initialValues={{
              name: owner.name || ''
            //   bio: owner.bio || '',
            }}
            onSubmit={(values, actions) => {
              handleSaveProfile(values);
              actions.setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form className="box" onSubmit={handleSubmit}>
                <p className='profile-email'>Email: {owner.email}</p>
                <div className='input-box'>
                  {/* <label>Name: </label> */}
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                {/* <div className='input-box'>
                  <input
                    type="text"
                    id="bio"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    placeholder="Enter your bio"
                  />
                </div> */}
                <button className="button" type="submit" disabled={isSubmitting}>
                  Save
                </button>
              </form>
            )}
          </Formik>
          <div className="button-logout">
          <button className='button-logout' onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Profile;
