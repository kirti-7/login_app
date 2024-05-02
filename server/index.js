// const express = require('express');

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connection from './database/mongodb.js'; 
import router from './router/route.js';
import bcrypt from 'bcrypt';

const app = express();

// middlewares 
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const port = 8080;

// HTTP GET request 
app.get('/', (req, res)=>{
    res.status(201).json("Home GET request");
})


// api routes
app.use('/api', router)



// start server only when we have valid connection
connection().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Couldn't connect to the server");
    }
}).catch(error => {
    console.log(error);
})


