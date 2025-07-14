import {validateToken} from "../../services/TokenService.js";

export default {
    Query: {
        validateToken: (_, {token}) => {
            return validateToken(token)
        }
    },
}
