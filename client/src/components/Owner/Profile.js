import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { fetchCurrentOwner, updateOwnerProfile, selectOwner, logoutOwner } from '../../reducers/ownerSlice';
import './owner.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const owner = useSelector(selectOwner);

  useEffect(() => {
    dispatch(fetchCurrentOwner());
  }, [dispatch]);

  const handleSaveProfile = (values) => {
    dispatch(updateOwnerProfile(values));
  };

  const handleLogout = async () => {
    await dispatch(logoutOwner());
    navigate('/');
  };

  return (
    <div className="profile">
      <h1>Hello {owner ? owner.name : ''}!</h1>
      {owner && (
        <>
          <Formik
            initialValues={{ name: owner.name || '' }}
            onSubmit={(values, actions) => {
              handleSaveProfile(values);
              actions.setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form className="box" onSubmit={handleSubmit}>
                <p className="profile-email">Email: {owner.email}</p>
                <div className="input-box">
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

                <h2>Your Pets</h2>
                {owner.pets && owner.pets.length > 0 ? (
                  <ul>
                    {owner.pets.map((pet) => (
                      <li key={pet.id}>
                        {pet.name} - {pet.breed}, Age: {pet.age}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>You have no pets added yet.</p>
                )}
              </form>
            )}
          </Formik>

          <div className="button-logout">
            <button className="button-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}


export default Profile;
