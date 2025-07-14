
import { loginFailByUsername} from '../../services/LoginFailService.js'
import {AuthenticationError} from "apollo-server-errors";

export default {
    Query: {
        loginFailByUsername: (_, {time, unit}, {user}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return loginFailByUsername(time, unit)
        },
        
    },
}

