import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { avatar } from '../assets';
import useFetch from '../hooks/fetch.hook'
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { validateUsername } from '../helper/validate';
import { useAuthStore } from '../store/store';


import { usernameStyles } from '../styles'
import { getUsername } from '../helper/helper';

const Username = () => {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);
  // const username = useAuthStore(state => console.log(state.auth.username));

  const token = localStorage.getItem('token');
  if (token) {
    navigate(`/profile`);
  }

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validate: validateUsername,
    validateOnBlur: false,
    validateOnChange: false, 
    onSubmit: async values => {
      setUsername(values.username);
      navigate('/password');
      // console.log(values);
    }
  });


  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={usernameStyles.glass} style={{height: "max-content"}} >
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>
          <form action="" className="py-1" onSubmit={formik.handleSubmit} >
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={usernameStyles.profile_img} alt="avatar" />
            </div>
            <div className="textbox flex flex-col items-center gap-6 ">
              <input {...formik.getFieldProps('username')} type="text" className={usernameStyles.textbox} placeholder='Username' />
              <button type="submit"className={usernameStyles.btn} >Let's go</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Not a member? <Link className='text-red-500' to='/register'>Register Now!</Link> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Username