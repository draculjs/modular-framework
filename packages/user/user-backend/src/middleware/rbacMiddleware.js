
import {UserRbacFactory} from "../services/RbacService";


export default async function (req, res, next) {
    try {

        if(req && req.user){
            req.rbac = await UserRbacFactory(req.user)
        }

        next()
    } catch (error) {
        console.error("Rbac Middleware error:", error)
        next(error);
    }

}

