import {expressjwt} from 'express-jwt'
import { config } from 'dotenv';
config()

const jwtMiddleware = expressjwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
})


export default jwtMiddleware
