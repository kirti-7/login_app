import React from 'react'
import {  useNavigate, Navigate } from 'react-router-dom'
import { resetPassword } from '../helper/helper'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { validateResetPassword } from '../helper/validate'
import { useAuthStore } from '../store/store'
import useFetch from '../hooks/fetch.hook'

import { usernameStyles } from '../styles'

const Reset = () => {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);

  const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');
  

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validate: validateResetPassword,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: "Updating password, please wait!",
        success: <b>Password updated successfully</b>,
        error: <b>Failed to update password. Please try again later.</b>
      });
      resetPromise.then(navigate('/password'));
    }
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  if (status && status !== 201) return <Navigate to={'/password'} replace={true} ></Navigate>


  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={usernameStyles.glass} >
        {/* <div className={usernameStyles.glass} style={{width:"50%"}} > */}
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>
          <form action="" className="py-20" onSubmit={formik.handleSubmit} >
            
            <div className="textbox flex flex-col items-center gap-6 ">
              <input {...formik.getFieldProps('password')} type="text" className={usernameStyles.textbox} placeholder='Password' />
              <input {...formik.getFieldProps('confirm_password')} type="text" className={usernameStyles.textbox} placeholder='Confirm password' />
              <button type="submit" className={usernameStyles.btn} >Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reset