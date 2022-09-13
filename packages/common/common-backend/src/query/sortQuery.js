export const sortQuery = (orderBy, orderDesc) => {
    if (orderBy) {
        return (orderDesc ? '-' : '') + orderBy
    } else {
        return null
    }
}

export default sortQuery
