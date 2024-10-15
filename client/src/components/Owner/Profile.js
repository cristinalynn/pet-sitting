import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Formik } from 'formik';
import './owner.css'
import EditPets from '../Pets/EditPets';

function Profile({onLogout}) {
  const [owner, setOwner] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [errorMessage, setErrorMessage] = useState('')
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

  const handleEditClick = (pet) => {
    setEditingPet(pet); // Set the selected pet for editing
  };

  const handleCancelEdit = () => {
    setEditingPet(null); // Cancel editing
  };

  const updatePets = (updatedPet) => {
    // Update the pet list after editing
    const updatedPets = owner.pets.map((pet) =>
      pet.id === updatedPet.id ? updatedPet : pet
    );
    setOwner({ ...owner, pets: updatedPets });
  };

  const handleDeletePet = async (petId) => {
    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the pet from the list after successful deletion
        const updatedPets = owner.pets.filter((pet) => pet.id !== petId);
        setOwner({ ...owner, pets: updatedPets });
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete the pet.');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      setErrorMessage('An error occurred while deleting the pet.');
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
                
                <button className="button" type="submit" disabled={isSubmitting}>
                  Save
                </button>
                {/* Display the owner's pets */}
          <h2>Your Pets</h2>
          {owner.pets && owner.pets.length > 0 ? (
            <ul>
              {owner.pets.map((pet) => (
                <li key={pet.id}>
                  {pet.name} - {pet.breed}, Age: {pet.age}
                  <button className='button' onClick={() => handleEditClick(pet)}> Edit </button>
                  <button className='button' onClick={() => handleDeletePet(pet.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no pets added yet.</p>
          )}
          {editingPet && (
            <EditPets
                pet={editingPet}
                onCancel={handleCancelEdit}
                updatePets={updatePets}
            />
          )}
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
