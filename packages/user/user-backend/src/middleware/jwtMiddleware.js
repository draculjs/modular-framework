import {expressjwt} from 'express-jwt'
require('dotenv').config()

const jwtMiddleware = expressjwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
})


export default jwtMiddleware
