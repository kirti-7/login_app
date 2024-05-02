import toast from "react-hot-toast";
import {authenticate} from './helper'


// validate login page username 
export async function validateUsername(values) {
    const errors = usernameVerify({}, values);

    if (values.username) {
        // check user exist or not 
        const { status } = await authenticate(values.username);
        
        if (status !== 200) {
            errors.exist = toast.error('Username doesn\'t exist')
        }

    }
    return errors;
}

// validate password
export async function validatePassword(values) {
    const errors = passwordVerify({}, values);
    return errors;
}

// validate reset password 
export async function validateResetPassword(values) {
    const errors = passwordVerify({}, values);
    if (values.password !== values.confirm_password) {
        errors.exist = toast.error("Password does not match. Please try again.");
    }
    return errors;
}

// validate register form 
export async function validateRegisterForm(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    return errors;
}

// validate profile page
export async function validateProfilePage(values) {
    const errors = emailVerify({}, values);
    return errors;
}


// *******************************************************************************************************

// validate password
function passwordVerify(errors = {}, values) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!values.password) {
        errors.password = toast.error("Password Required...!");
    } else if (values.password.includes(" ")) {
        errors.password = toast.error("Invalid password");
    } else if (values.password.length < 6 ) {
        errors.password = toast.error("Length must be at least 6");
    } else if (!specialChars.test(values.password)) {
        errors.password = toast.error("Password must have a special character");
    }
    return errors;
}

// validate username 
function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error("Username Required...!");
    } else if (values.username.includes(" ")) {
        error.username = toast.error("Invalid username");
    }

    return error;
}

// validate email 
function emailVerify(error = {}, values) {
    if(!values.email){
        error.email = toast.error("Email Required...!");
    } else if (values.email.includes(" ") || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error("Invalid email address.");
    }
    return error;
}
