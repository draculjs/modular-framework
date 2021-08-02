import {
    recoveryChangePassword,
    recoveryPassword,
    recoveryPasswordByCode,
    recoveryChangePasswordCode
} from "../../services/RecoveryService";

export default {
    Mutation: {
        recoveryChangePassword: (_, {token, newPassword}, {user, req}) => {
            return recoveryChangePassword(token, newPassword, req)
        },
        recoveryByEmail: (_, {email}) => {
            return recoveryPassword(email)
        },
        recoveryByCode: (_, {email}) => {
            return recoveryPasswordByCode(email)
        },
        recoveryChangePasswordCode: (_, {code, newPassword}, {user, req}) => {
            return recoveryChangePasswordCode(code, newPassword)
        },
    }

}
