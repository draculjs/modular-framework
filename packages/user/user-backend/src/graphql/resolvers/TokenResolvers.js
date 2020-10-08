import {validateToken} from "../../services/TokenService";

export default {
    Query: {
        validateToken: (_, {token}) => {
            return validateToken(token)
        }
    },


}
