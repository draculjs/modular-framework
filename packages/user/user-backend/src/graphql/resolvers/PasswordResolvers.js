import {passwordRules} from "../../services/PasswordService";

export default {
    Query: {
        fetchPasswordRules: (_, {}, {}) => {
            console.log("passwordRules",passwordRules)
            return passwordRules
        },

    }

}
