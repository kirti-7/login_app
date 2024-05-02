import jwt from 'jsonwebtoken';

// auth middleware 
const auth = async (req, res, next) => {
    try {
        // access authorize header to validate request
        // const token = req.headers.authorization;
        const token = req.headers.authorization.split(" ")[1];

        // retrive the user details for the logged in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: " Authentication failed" })
    }
}


const localVariables = (req, res, next) => { 
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}

export {auth, localVariables};