import {DefaultLogger as winston} from "@dracul/logger-backend";
import jwt from "jsonwebtoken";
import {findUser} from "./UserService";

/*
    @input token
    @output {valid:Boolean!, operation:String!, message:String}
*/
export const validateToken = function (token) {
    return new Promise((resolve, rejects) => {
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET)

            if (!decoded) {
                resolve({valid: false, operation: 'none', message: "common.operation.fail"})
            }

            if (!findUser(decoded.id)) {
                resolve({valid: false, operation: 'none', message: "common.operation.fail"})
            }

            resolve({valid: true, operation: decoded.operation, message: "common.operation.success"})

        } catch (e) {
            winston.error("TokenService.validateToken", e)
            rejects(e)
        }

    })
}