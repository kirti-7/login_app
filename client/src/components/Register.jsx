import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { avatar } from '../assets'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { validateRegisterForm } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'


import { usernameStyles } from '../styles'

const Register = () => {

  const navigate = useNavigate();

  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: validateRegisterForm,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
      values = await Object.assign(values, { profile: file || '' });
        const registerPromise = registerUser(values);
        
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: (err) => {
          // Conditional rendering of error message
          return err && err.message ? <b>{err.message}</b> : <b>Could not register!</b>;
        }
      });
        registerPromise
          .then(navigate('/'))
          .catch((error) => {
            console.error('Error during form submission:', error)
          });
      } catch (error) {
        console.error('Error during form submission:', error);
        toast.error('An unexpected error occurred!');
      }
    }

  });

  // formik doesnt support file upload so we need to create this handler 
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }


  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={usernameStyles.glass} style={{width:"45%", height: "max-content"}} >
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to have you.
            </span>
          </div>
          <form action="" className="py-1" onSubmit={formik.handleSubmit} >
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} className={usernameStyles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-6 ">
              <input {...formik.getFieldProps('email')} type="text" className={usernameStyles.textbox} placeholder='Email' />
              <input {...formik.getFieldProps('username')} type="text" className={usernameStyles.textbox} placeholder='Username' />
              <input {...formik.getFieldProps('password')} type="text" className={usernameStyles.textbox} placeholder='Password' />
              <button type="submit" className={usernameStyles.btn} >Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Already have an account? <Link className='text-red-500' to='/'>Login Now!</Link> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register