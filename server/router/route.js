import { Router } from 'express';

// import all controllers
import * as controller from '../controllers/controller.js';

import { registerMail } from '../controllers/mailer.js';
import {auth, localVariables} from '../middleware/auth.js';


const router = Router();


// POST Methods
router.route('/register').post(controller.register); //register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser,(req,res)=> res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser,controller.login); // login the user


// GET Methods
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

// PUT Methods
router.route('/updateuser').put(auth,controller.updateUser); // is use to update user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;