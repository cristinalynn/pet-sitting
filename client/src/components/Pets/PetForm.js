import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchPets, editPet, deletePet, selectPets, selectPetsStatus, selectPetsError } from '../../reducers/petSlice';
import './petform.css';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  breed: Yup.string().required('Breed is required'),
  age: Yup.number().positive('Age must be positive').integer('Age must be an integer').required('Age is required'),
});

const EditPets = () => {
  const dispatch = useDispatch();
  const pets = useSelector(selectPets);
  const status = useSelector(selectPetsStatus);
  const error = useSelector(selectPetsError);
  const [editingPet, setEditingPet] = useState(null);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const handleDeletePet = async (petId) => {
    await dispatch(deletePet(petId));
  };

  const handleCancel = () => setEditingPet(null);

  const handleSubmit = async (values) => {
    await dispatch(editPet(values));
    setEditingPet(null);
  };

  return (
    <div className="edit-pet-card">
      <h1>Your Pets</h1>

      {/* Display loading state */}
      {status === 'loading' && <div className="loading">Loading pets...</div>}
      
      {/* Display error message */}
      {error && <div className="error">{error}</div>}

      {/* Display pets if available */}
      {status === 'succeeded' && pets.length > 0 ? (
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
        status === 'succeeded' && <p>You have no pets added yet.</p>
      )}

      {/* Display form for editing pet */}
      {editingPet && (
        <div className="edit-pets-form">
          <h2>Edit Pet Data</h2>
          <Formik
            initialValues={editingPet}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              handleSubmit(values);
              actions.setSubmitting(false);
            }}
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
