import UserModel from "../models/User.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import 'dotenv/config';
import otpGenerator from 'otp-generator';




// middleware for verify user 
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance 
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find user" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication error" });
    }
}

// POST: http://localhost:8080/api/register
// @param: {
//     "username": "example123",
//     "password": "admin123",
//     "email": "example123@example.com",
//     "firstName": "Kirti",
//     "lastName": "Valechha",
//     "mobile": 1234567890,
//     "address": "Apt. 777, New York, NY, USA",
//     "profile":""
// }
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // check the existing user 
        // const existingUsername = new Promise((resolve, reject) => { 
        //     // UserModel.findOne({ username }, function (err, username) {
        //     //     if (err) reject(new Error(err))
        //     //     if (username) reject({ error: "Please use unique username." });
        //     //     resolve();
        //     // })

        // //     Mongo dropped support for callbacks from its node.js driver as of version 5.0
        // //     in favour of a Promise - only public API.Mongoose also dropped callback support
        // //    in v7 so findOne() and other methods now always return a promise.
        // })

        // // check for existing email address
        // const existingEmail = new Promise((resolve, reject) => {
        //     // UserModel.findOne({ email }, function (err, email) {
        //     //     if (err) reject(new Error(err))
        //     //     if (email) reject({ error: "Please use unique email." });
        //     //     resolve();
        //     // })
        // })

        // Check if the username already exists
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            // console.log("Username already exists.");
            return res.status(400).json({ error: "Username already exists." });
        }

        // Check if the email already exists
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            // console.log("Email already exists.");
            return res.status(400).json({ error: "Email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email,
        });

        // user.save()
        //     .then(result => res.status(201).send({ msg: "User Registered Successfully." }))
        //     .catch(error => {
        //         console.error("Save error:", error);
        //         res.status(500).send({ msg: "Failed to save user" });
        //     })


        await user.save();

        return res.status(201).send({ msg: "User Registered Successfully." });

        // Promise.all([existingUsername, existingEmail])
        //     .then(() => {
        //         console.log(UserModel)
        //         if (password) {
        //             bcrypt.hash(password, 10)
        //                 .then(hashedPassword => {
        //                     console.log(hashedPassword)
        //                     const user = new UserModel({
        //                         username,
        //                         password: hashedPassword,
        //                         profile: profile || '',
        //                         email
        //                     });
        //                     // return and save the result as a response
        //                     user.save()
        //                         .then(result => res.status(201).send({ msg: "User Registered Successfully." }))
        //                         .catch(error => {
        //                             console.error("Save error:", error);
        //                             res.status(500).send({ msg: "Failed to save user" });
        //                     })
        //                 }).catch(error => {
        //                     console.error("Hashing error:", error);
        //                     res.status(500).send({ msg: "Error hashing password" });
        //                 })
        //         }
        //     }).catch(error => {
        //         console.error("Promise error:", error);
        //         res.status(500).send({ msg: "Promise failed" });
        //     })

    } catch (error) {
        console.log("Error during registration:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// POST: http://localhost:8080/api/login 
// @param: {
//     "username": "example123",
//     "password": "admin123",
// }
export async function login(req, res) {
    const { username, password } = req.body;
    // console.log(process.env.JWT_SECRET_KEY);
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Invalid Password" });
                        // create jwt token

                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username,
                        }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

                        // console.log(token)

                        return res.status(200).send({
                            msg: "Login Successfully",
                            username: user.username,
                            token
                            
                        })
                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not match." })
                    })
            }).catch(error => {
                return res.status(404).send({ error: "Username not found" })
            })
    } catch (error) {
        return res.status(500).send({ error });
    }
}

// GET: http://localhost:8080/api/user/example123 
export async function getUser(req, res) {
    const { username } = req.params;

    try {

        if (!username) return res.status(501).send({ error: "Invalid user." });
        UserModel.findOne({ username })
            .then((user) => {

                if (!user) return res.status(501).send({ error: "Couldn't find user." });


                // remove password form user
                // mongoose return unnecessary data with object so conver it into json 
                const { password, ...rest } = Object.assign({}, user.toJSON());

                if (user) return res.status(201).send(rest);
            })
            .catch((error) => {
                return res.status(500).send({ error });
            })

    } catch (error) {
        return res.status(404).send({ error: "Cannot find user data" });
    }
}

// PUT: http://localhost:8080/api/updateUser
// @param {
//     "id":"<uderid>"
// }
// body: {
//     firstName: '',
//     address: '',
//     profile:''
// }
export async function updateUser(req, res) {
    try {
        // const id = req.query.id;

        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // update the data 
            UserModel.updateOne({ _id: userId }, body)
                .then(data => {
                    return res.status(201).send({ msg: "Record updated succeddfully" });
                })
                .catch(error => {
                    return res.status(401).send({ error });
                })
        } else {
            return res.status(401).send({ error: "User not found." })
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}

// GET: http://localhost:8080/api/generateOTP
export async function generateOTP(req, res) {
    req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    res.status(201).send({code: req.app.locals.OTP})
}

// GET: http://localhost:8080/api/verifyOTP 
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; //reset the OTP value
        req.app.locals.resetSession = true; //start session for resetPassword
        return res.status(201).send({ msg: "Verify Successfully" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is verified
// GET: http://localhost:8080/api/createResetSession
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        // req.app.locals.resetSession = false;
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(403).send({ error: "Session expired." });
}

// update the password when we have valid session 
// PUT: http://localhost:8080/api/resetPassword
export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(403).send({ error: "Session expired." });
        const { username, password } = req.body;
        try {
            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username }, { password: hashedPassword })
                                .then(() => {
                                    req.app.locals.resetSession = false;
                                    res.status(201).send({ msg: "Record Updated!" })
                                })
                                .catch(error => {
                                    return res.status(500).send({ error });
                            })
                        })
                        .catch(error => {
                            return res.status(500).send({ error: "Enable to hashed password" });
                    })
                })
                .catch(error => {
                    return res.status(404).send({ error: "Username not found." });
                })
            
        } catch (error) {
            return res.status(500).send({ error });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}
