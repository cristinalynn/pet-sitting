import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './owner.css'
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
    name: yup.string()
      .name('Invalid name')
      .required('Name required'),
    email: yup.string()
      .email('Invalid email address')
      .required('Email required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password required'),
  });

const SignupForm = ({onSignUpSuccess}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [owner, setOwner] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          const data = await response.json();
          if (response.status === 409 && data.error === 'Email already exists') {
            setError('Email is already registered');
          } else {
            throw new Error('Signup failed');
          }
        } else {
          onSignUpSuccess();
          const data = await response.json();
          setOwner(data);
          navigate('/owner');
        }
      } catch (error) {
        console.error('Signup error:', error);
        setError('Signup failed');
      }
    },
  });

  return (
    <div classname="signupform">
        <form onSubmit={formik.handleSubmit}>
            <h2>Sign Up</h2>
            <div classname="input-box">
            <input
                placeholder="Name"
                name="name"
                type="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='error'>{formik.errors.name}</div>
            )}
            </div>
            <div classname="input-box">
            <input
                placeholder="Email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='error'>{formik.errors.email}</div>
            )}
            </div>
            <div classname="input-box">
                <input
                placeholder="Password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                   <div className='error'>{formik.errors.password}</div>
                )}
            </div>
            <button classname="button" type="submit">Create Account</button>
            {error && <div classname="error">{error}</div>}
            <p><a href="/login"></a></p>
        </form>
    </div>
 );
}; 


export default SignupForm;
