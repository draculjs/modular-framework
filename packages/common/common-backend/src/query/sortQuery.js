const sortQuery = (orderBy, orderDesc) => {
    if (orderBy) {
        return (orderDesc ? '-' : '') + orderBy
    } else {
        return null
    }
}

module.exports = sortQuery
module.exports.sortQuery = sortQuery
