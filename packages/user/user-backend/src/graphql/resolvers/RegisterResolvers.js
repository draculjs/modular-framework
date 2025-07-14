import {
    activationUser,
    registerUser
} from "../../services/RegisterService.js";

export default {

    Mutation: {
        register: (_, {input}) => {
            return registerUser(input)
        },
        activationUser: (_, {token}, {req}) => {
            return activationUser(token, req)
        }
    }

}
