
import { loginFailByUsername} from '../../services/LoginFailService'
import {AuthenticationError} from "apollo-server-express";

export default {
    Query: {
        loginFailByUsername: (_, {time, unit}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return loginFailByUsername(time, unit)
        },
        
    },


}

