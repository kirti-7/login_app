import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { avatar } from '../assets'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { validatePassword } from '../helper/validate'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import {verifyPassword} from '../helper/helper'

import { usernameStyles } from '../styles'

const Password = () => {

  const navigate = useNavigate();

  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validate: validatePassword,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const loginPromise = verifyPassword({ username, password: values.password });
      
        toast.promise(loginPromise, {
          loading: 'Verifying password',
          success: <b>Login Successful!</b>,
          error: <b>Incorrect Password!</b>
        });

        loginPromise.then(res => {
          // console.log(res);
          const { token } = res;
          // console.log(token);
          localStorage.setItem('token', token);
          navigate('/profile');
        }).catch((error) => {
          console.error('Error during login:', error);
          // toast.error('Incorrect Password!');
        });
      } catch (error) {
        console.error('Error during form submission:', error);
        toast.error('An unexpected error occurred!');
      }
    }
  });

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={usernameStyles.glass} style={{ height: "max-content" }} >
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}  </h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>
          <form action="" className="py-1" onSubmit={formik.handleSubmit} >
            <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || avatar} className={usernameStyles.profile_img} alt="avatar" />
            </div>
            <div className="textbox flex flex-col items-center gap-6 ">
              <input {...formik.getFieldProps('password')} type="text" className={usernameStyles.textbox} placeholder='Password' />
              <button type="submit" className={usernameStyles.btn} >Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to='/recovery'>Recover Now!</Link> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Password