import { DefaultLogger } from "@dracul/logger-backend"

export default function sortQuery(orderBy, orderDesc){
    try {
        if (orderBy) {
            return (orderDesc ? '-' : '') + orderBy
        } else {
            return null
        }
    } catch (error) {
        DefaultLogger.error(`An error happened at sortQuery: ${error}`)
    }
}
