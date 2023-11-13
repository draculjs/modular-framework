import jwt from 'express-jwt'
require('dotenv').config()

const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
})


export default jwtMiddleware
