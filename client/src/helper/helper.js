import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


// Make API requests

// To get username from token 
export async function getUsername(){
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject("Cannot find Token");
    let decode = jwtDecode(token);
    return decode;
}


// authenticate function
const authenticate = async (username) => {

    try {
        
        return await axios.post('/api/authenticate', { username });
    } catch (error) {
        return {error: "Username doesn't exist!"}
    }
}

// get User details
export async function getUser({username}) {
    try {
        const getResult = await axios.get(`/api/user/${username}`);
        const { data } = getResult;
        // console.log(getResult);
        // console.log({data});
        return { data };
    } catch (error) {
        return { error: "Password doesn't match!" };
    }
}

// register user function 
const registerUser = async (credentials) => {
    try {

        // console.log(credentials);
        const { data: { msg }, status } = await axios.post('/api/register', credentials);
        let { username, email } = credentials;

        // send email 
        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
            
        }

        return Promise.resolve(msg);

    } catch (error) {
        return Promise.reject({error});
    }
}

// login function 
const verifyPassword = async ({username, password}) => {
    try {
        if (username) {
            const data = await axios.post('/api/login', { username, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't match!" });
    }
}

// update user profile function
const updateUser = async (response) => {
    try {
        
        const token = localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } });

        return Promise.resolve({ data });

    } catch (error) {
        return Promise.reject({ errror: "Couldn't update user profile" });
    }
}

// generate OTP 
const generateOTP = async (username) => {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username: username } });

        // send mail with OTP 
        if (status === 201) {
            let { data: { email } } = await getUser({ username });
            let text = `Your password recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password recovery OTP" });
            return Promise.resolve(code);
            
        }
    } catch (error) {
        return Promise.reject({ error });
    }
}

// verify OTP
const verifyOTP = async ({username, code}) => {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };
    } catch (error) {
        return Promise.reject(error);
    }
}

const resetPassword = async ({ username, password }) => {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject(error);
    }
}









export {authenticate, registerUser, verifyPassword, updateUser, generateOTP, verifyOTP, resetPassword}