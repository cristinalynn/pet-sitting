import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PetForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    service_id: '',  // Replace availability_id with service_id
    owner_id: '',
  });

  const [currentOwner, setCurrentOwner] = useState(null);
  const [services, setServices] = useState([]); // Fetch services instead
  const [selectedService, setSelectedService] = useState(null); // Store selected service
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCurrentOwner = async () => {
      try {
        const response = await fetch('/api/check_session');
        if (response.ok) {
          const ownerData = await response.json();
          setCurrentOwner(ownerData);
          setFormData((prevState) => ({
            ...prevState,
            owner_id: ownerData.id,
          }));
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
      }
    };

    fetchCurrentOwner();
  }, [navigate]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData({ ...formData, service_id: service.id });
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

        // Reset form data
        setFormData({
            name: '',
            breed: '',
            age: '',
            service_id: '',  // Ensure the field name matches
            owner_id: formData.owner_id,  // Retain owner_id
        });

        setSelectedService(null);  // Clear selected service

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

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes < 1440) {  // Less than 1 day (1440 minutes)
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? `, ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingMinutes = minutes % 1440;
      const hours = Math.floor(remainingMinutes / 60);
      return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? `, ${hours} hour${hours > 1 ? 's' : ''}` : ''}`;
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
          <h3>Select a Service</h3>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Price ($)</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  style={{
                    backgroundColor: selectedService?.id === service.id ? 'lightblue' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <td>{service.name}</td>
                  <td>{service.price}</td>
                  <td>{formatDuration(service.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedService && (
            <p>Selected Service: {selectedService.name}</p>
          )}
        </div>

        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
}

export default PetForm;
