import React, { useState } from 'react';

const EditPets = ({ pet, onCancel, updatePets }) => {
  const [formData, setFormData] = useState({ ...pet });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { name, breed, age } = formData;
    const errors = {};

    if (!name) errors.name = 'Name is required';
    if (!breed) errors.breed = 'Breed is required';
    if (!age) errors.age = 'Age is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update pet');
      }
      updatePets(formData);
      onCancel(); // CLOSES EDIT FORM
    } catch (error) {
      console.error('Update error:', error);
      setError('Update failed');
    }
  };
  return (
    <div className="edit-pets-form">
      <h2>Edit Pet Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          {/* <label>Name:</label> */}
          <input
            placeholder="Name"
            name="name"
            type="text"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && <div className='error'>{errors.name}</div>}
        </div>
        <div className="input-box">
        {/* <label>Breed:</label> */}
          <textarea
            placeholder="Breed"
            name="breed"
            type="text"
            onChange={handleChange}
            value={formData.breed}
          />
          {errors.breed && <div className='error'>{errors.breed}</div>}
        </div>
        <div className="input-box">
        {/* <label>Age:</label> */}
          <textarea
            placeholder="Age"
            name="age"
            type="number"
            onChange={handleChange}
            value={formData.age}
          />
          {errors.age && <div className='error'>{errors.age}</div>}
        </div>
        <button className="button" type="submit">Save</button>
        <button className="button" type="button" onClick={onCancel}>Cancel</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};



export default EditPets;