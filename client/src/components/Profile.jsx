import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { avatar } from '../assets'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { validateProfilePage } from '../helper/validate'
import { updateUser } from '../helper/helper'
import useFetch from '../hooks/fetch.hook'
import convertToBase64 from '../helper/convert'

import { usernameStyles, profileStyles } from '../styles'

const Profile = () => {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();

  // console.log(apiData);
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
      profile: apiData?.profile || file,
    },
    enableReinitialize: true,
    validate: validateProfilePage,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successful.</b>,
        error: <b>Could not update!</b>
      })
      
    }
  });

  // formik doesnt support file upload so we need to create this handler 
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout() {
    localStorage.removeItem('token');
  }

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={`${usernameStyles.glass} ${profileStyles.glass}`} style={{ width: "45%" }} >
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              You can update the details.
            </span>
          </div>
          <form action="" className="py-1" onSubmit={formik.handleSubmit} >
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} className={`${usernameStyles.profile_img} ${profileStyles.profile_img}`} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-6 ">

              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('firstName')} type="text" className={`${usernameStyles.textbox} ${profileStyles.textbox}`} placeholder='FirstName' />
                <input {...formik.getFieldProps('lastName')} type="text" className={`${usernameStyles.textbox} ${profileStyles.textbox}`} placeholder='LastName' />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('mobile')} type="text" className={`${usernameStyles.textbox} ${profileStyles.textbox}`} placeholder='Mobile No.' />
                <input {...formik.getFieldProps('email')} type="text" className={`${usernameStyles.textbox} ${profileStyles.textbox}`} placeholder='Email' />
              </div>
              
              <input {...formik.getFieldProps('address')} type="text" className={`${usernameStyles.textbox} ${profileStyles.textbox}`} placeholder='Address' />
              <button type="submit" className={usernameStyles.btn} >Update</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Come back later? <Link onClick={userLogout} className='text-red-500' to='/'>Log out!</Link> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile