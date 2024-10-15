import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  breed: Yup.string().required('Breed is required'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),
});

const EditPets = () => {
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the logged-in owner's pets
  useEffect(() => {
    fetch('/api/check_session')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch session');
      })
      .then((ownerData) => setPets(ownerData.pets))
      .catch((err) => setErrorMessage('Failed to load pets.'));
  }, []);

  const updatePets = (updatedPet) => {
    const updatedList = pets.map((pet) =>
      pet.id === updatedPet.id ? updatedPet : pet
    );
    setPets(updatedList);
    setEditingPet(null); // Close edit form
  };

  const handleDeletePet = async (petId) => {
    try {
      const response = await fetch(`/api/pets/${petId}`, { method: 'DELETE' });
      if (response.ok) {
        setPets(pets.filter((pet) => pet.id !== petId));
      } else {
        throw new Error('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      setErrorMessage('Failed to delete pet.');
    }
  };

  const handleCancel = () => setEditingPet(null);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await fetch(`/api/pets/${editingPet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update pet');
      const updatedPet = await response.json();
      updatePets(updatedPet);
    } catch (error) {
      console.error('Update error:', error);
      setStatus('Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-pet-card">
      <h1>Your Pets</h1>

      {errorMessage && <div className="error">{errorMessage}</div>}

      {pets.length > 0 ? (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              {pet.name} - {pet.breed}, Age: {pet.age}
              <button className="button" onClick={() => setEditingPet(pet)}>
                Edit
              </button>
              <button className="button" onClick={() => handleDeletePet(pet.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no pets added yet.</p>
      )}

      {editingPet && (
        <div className="edit-pets-form">
          <h2>Edit Pet Data</h2>
          <Formik
            initialValues={editingPet}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form>
                <div className="input-box">
                  <Field name="name" type="text" placeholder="Name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>

                <div className="input-box">
                  <Field name="breed" type="text" placeholder="Breed" />
                  <ErrorMessage name="breed" component="div" className="error" />
                </div>

                <div className="input-box">
                  <Field name="age" type="number" placeholder="Age" />
                  <ErrorMessage name="age" component="div" className="error" />
                </div>

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>

                {status && <div className="error">{status}</div>}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default EditPets;
