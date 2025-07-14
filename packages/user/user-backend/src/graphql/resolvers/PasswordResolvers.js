import {passwordRules} from "../../services/PasswordService.js";

export default {
    Query: {
        fetchPasswordRules: (_, {}, {}) => {
            console.log("passwordRules",passwordRules)
            return passwordRules
        },

    }

}
