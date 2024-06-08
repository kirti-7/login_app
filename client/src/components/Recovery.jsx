import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/store'
import toast, { Toaster } from 'react-hot-toast'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

import { usernameStyles } from '../styles'

const Recovery = () => {

  const navigate = useNavigate()
  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      // console.log(OTP);
      if (OTP) return toast.success('OTP has been sent to your email address.');
      return toast.error('Problem while generating OTP.');
    })
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success('Verified successfully.');
        return navigate('/reset');
      }
    } catch (error) {
      return toast.error('Wrong OTP! Please try again.');
    }
  }

  // handler of reset OTP 
  function resendOTP() {
    let sendPromise = generateOTP(username);

    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not send it!</b>
    });
    // sendPromise.then(OTP => {
    //   // console.log(OTP);
    // });
  }



  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={usernameStyles.glass} >
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover password.
            </span>
          </div>
          <form action="" className="pt-20" onSubmit={onSubmit} >

           
            <div className="textbox flex flex-col items-center gap-6 ">
              <div className='text-center input' type="text">
                <span className="py-4 text-sm text-left text-gray-500 ">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input onChange={e=>setOTP(e.target.value)} type="text" className={usernameStyles.textbox} placeholder='OTP' />
              </div>
              <button type="submit" className={usernameStyles.btn} >Recover</button>
            </div>
          </form>
            <div className="text-center py-4">
              <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500' to='/recovery'>Resend.</button> </span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Recovery