const searchQuery = (searchFields, searchString) => {

    let qs = {}

    if (searchFields && searchFields.length > 0 && searchString) {

        let or = searchFields.map(field => {
            return {
                [field]: {$regex: searchString, $options: 'i'}
            }

        })

        qs = { $or: or}
    }

    return qs
}

module.exports = searchQuery
module.exports.searchQuery = searchQuery

