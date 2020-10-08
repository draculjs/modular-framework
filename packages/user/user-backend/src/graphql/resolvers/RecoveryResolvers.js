import {
    recoveryChangePassword,
    recoveryPassword
} from "../../services/RecoveryService";

export default {
    Mutation: {
        recoveryChangePassword: (_, {token, newPassword}, {user, req}) => {
            return recoveryChangePassword(token, newPassword, req)
        },
        recoveryByEmail: (_, {email}) => {
            return recoveryPassword(email)
        },
    }

}
