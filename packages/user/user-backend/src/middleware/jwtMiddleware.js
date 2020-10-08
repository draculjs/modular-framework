import jwt from 'express-jwt'
require('dotenv').config()

const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
})


export default jwtMiddleware