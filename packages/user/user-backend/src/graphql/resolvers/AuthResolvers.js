import {
    findUser,
} from '../../services/UserService'
import {apiKey, auth} from "../../services/AuthService";

import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {SECURITY_USER_EDIT} from "../../permissions";

export default {
    Query: {
        me: (_, {}, {user}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            return findUser(user.id)
        },
    },
    Mutation: {
        auth: (_, {username, password}, {req}) => {

            return new Promise((resolve, reject) => {

                auth({username, password}, req)
                    .then(r => resolve({token: r.token}))
                    .catch(err => {
                        console.warn('Auth error: ', err.message)
                        reject(new AuthenticationError("BadCredentials"))
                    })

            })

        },
        apikey: (_, {userid}, {user, rbac, req}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")

            return new Promise((resolve, reject) => {
                apiKey(userid, req)
                    .then(r => resolve({token: r.token}))
                    .catch(err => {
                        console.warn('ApiKey error: ', err.message)
                        reject(new AuthenticationError("BadCredentials"))
                    })

            })


        }
    }

}
