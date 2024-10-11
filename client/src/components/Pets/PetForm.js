import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PetForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    availability_id: '',
    owner_id: '', 
  });

  const [currentOwner, setCurrentOwner] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCurrentOwner = async () => {
      try {
        const response = await fetch('/api/check_session');
        if (response.ok) {
          const ownerData = await response.json();
          setCurrentOwner(ownerData);
          // Set owner_id in the form data
          setFormData(prevState => ({
            ...prevState,
            owner_id: ownerData.id,
          }));
        } else {
          // Redirect to login page if not authenticated
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
      }
    };

    fetchCurrentOwner();
  }, [navigate]);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability');
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    setSelectedAvailability(value);
    setFormData({ ...formData, availability_id: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Pet added successfully!');
        setErrorMessage('');
        // Optionally clear form data or navigate
        navigate('/pets');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to add the pet.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An error occurred while submitting the form.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Add a New Pet</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pet Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Breed:</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Availability:</label>
          <select
            name="availability_id"
            value={selectedAvailability}
            onChange={handleAvailabilityChange}
            required
          >
            <option value="">Select Availability</option>
            {availability.map(option => (
              <option key={option.id} value={option.id}>
                {option.name} {/* Assuming the availability data has a 'name' field */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
}

export default PetForm;
