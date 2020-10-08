const validatePasswordLength = function (password) {
    const minimunLength = process.env.PASSWORD_MINIMUN_LENGTH ? process.env.PASSWORD_MINIMUN_LENGTH : 1
    if (password.length >= minimunLength) {
        return true
    } else {
        return false
    }
}

export default validatePasswordLength