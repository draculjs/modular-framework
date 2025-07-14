import { DefaultLogger } from "@dracul/logger-backend"

export default function searchQuery(searchFields, searchString){
    try {
        let qs = {}
    
        if (searchFields && searchFields.length > 0 && searchString) {
            const or = searchFields.map(field => ({[field]: {$regex: searchString, $options: 'i'}}))
            qs = { $or: or}
        }
    
        return qs
    } catch (error) {
        DefaultLogger.error(`An error happened at searchQuery: ${error}`)
    }
}