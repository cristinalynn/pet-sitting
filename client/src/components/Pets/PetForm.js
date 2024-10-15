import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // For form validation schema
import './petform.css';

function PetForm() {
  const navigate = useNavigate();
  const [currentOwner, setCurrentOwner] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCurrentOwner = async () => {
      try {
        const response = await fetch('/api/check_session');
        if (response.ok) {
          const ownerData = await response.json();
          setCurrentOwner(ownerData);
          formik.setFieldValue('owner_id', ownerData.id); // Set owner_id in Formik
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

  const formik = useFormik({
    initialValues: {
      name: '',
      breed: '',
      age: '',
      service_id: '',
      owner_id: '', // This will be populated by the owner session check
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Pet name is required'),
      breed: Yup.string().required('Breed is required'),
      age: Yup.number()
        .min(0, 'Age must be a positive number')
        .required('Age is required'),
      service_id: Yup.string().required('Please select a service'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setSuccessMessage('Pet added successfully!');
          setErrorMessage('');

          formik.resetForm();
          setSelectedService(null);
          navigate('/owner');
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
    },
  });

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    formik.setFieldValue('service_id', service.id); // Set service_id in Formik
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''}${
        remainingMinutes > 0 ? `, ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''
      }`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingMinutes = minutes % 1440;
      const hours = Math.floor(remainingMinutes / 60);
      return `${days} day${days > 1 ? 's' : ''}${
        hours > 0 ? `, ${hours} hour${hours > 1 ? 's' : ''}` : ''
      }`;
    }
  };

  return (
    <div className="add-pet-card">
      <h2>Add a New Pet</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Pet Name:</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error-message">{formik.errors.name}</div>
          ) : null}
        </div>

        <div>
          <label>Breed:</label>
          <input
            type="text"
            name="breed"
            value={formik.values.breed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.breed && formik.errors.breed ? (
            <div className="error-message">{formik.errors.breed}</div>
          ) : null}
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.age && formik.errors.age ? (
            <div className="error-message">{formik.errors.age}</div>
          ) : null}
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
                    backgroundColor:
                      selectedService?.id === service.id ? 'lightblue' : 'white',
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
          {selectedService && <p>Selected Service: {selectedService.name}</p>}
          {formik.touched.service_id && formik.errors.service_id ? (
            <div className="error-message">{formik.errors.service_id}</div>
          ) : null}
        </div>

        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
}

export default PetForm;
