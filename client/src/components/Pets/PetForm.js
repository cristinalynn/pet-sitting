import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchPets, addPet, selectPets, selectPetsStatus, selectPetsError } from '../../reducers/petSlice';
import './petform.css';

function PetForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const services = useSelector(selectPets); // Assuming services data comes from selectPets
  const status = useSelector(selectPetsStatus);
  const error = useSelector(selectPetsError);
  const [selectedService, setSelectedService] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchPets()); // Fetch pets and/or services using this action
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      breed: '',
      age: '',
      service_id: '',
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
        await dispatch(addPet(values)).unwrap();
        setSuccessMessage('Pet added successfully!');
        formik.resetForm();
        setSelectedService(null);
        navigate('/owner');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    formik.setFieldValue('service_id', service.id);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes ? `, ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
  };

  return (
    <div className="add-pet-card">
      <h2>Add a New Pet</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {status === 'loading' && <p className="loading">Loading services...</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Pet Name:</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error-message">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label>Breed:</label>
          <input
            type="text"
            name="breed"
            value={formik.values.breed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.breed && formik.errors.breed && (
            <div className="error-message">{formik.errors.breed}</div>
          )}
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.age && formik.errors.age && (
            <div className="error-message">{formik.errors.age}</div>
          )}
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
          {selectedService && <p>Selected Service: {selectedService.name}</p>}
          {formik.touched.service_id && formik.errors.service_id && (
            <div className="error-message">{formik.errors.service_id}</div>
          )}
        </div>

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Adding Pet...' : 'Add Pet'}
        </button>
      </form>
    </div>
  );
}

export default PetForm;
