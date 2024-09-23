/**
 * Check if a variable is a function
 * @param functionToCheck
 * @returns {boolean}
 */
function isFunction(functionToCheck) {
    return functionToCheck &&
        ({}.toString.call(functionToCheck) === '[object Function]' ||
            {}.toString.call(functionToCheck) === '[object AsyncFunction]');
}

module.exports = isFunction
