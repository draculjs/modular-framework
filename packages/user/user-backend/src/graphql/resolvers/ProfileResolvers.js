import {AuthenticationError} from "apollo-server-express";
import {avatarUpload, changePassword} from "../../services/ProfileService";

export default {
    Mutation: {

        changePassword: (_, {currentPassword, newPassword}, {user}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            return changePassword(user.id, {currentPassword, newPassword}, user)
        },

        avatarUpload: (_, {file}, {user}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            return avatarUpload(user, file)
        },

    }

}
