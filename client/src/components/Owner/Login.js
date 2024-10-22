import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../reducers/ownerSlice';
import './owner.css';


const validationSchema = yup.object({  
  email: yup.string().email('Invalid email address').required('Email required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password required'),
});

const Login = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap();
        onLoginSuccess();
        navigate('/owner');
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  return (
    <div className="loginform">
      <div className="box">
        <form onSubmit={formik.handleSubmit}>
          <h2>Login</h2>
          <div className="input-box">
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
          <div className="input-box">
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
          <button className="button" type="submit">Login</button>
          <p><a href="/signup">Sign Up</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
