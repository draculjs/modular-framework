/**
 * Check if a variable is a plain object
 * @param o
 * @returns {boolean}
 */
const isPlainObject = function(o) {
    return (o === null || Array.isArray(o) || typeof o == 'function' || o.constructor === Date) ?
        false
        : (typeof o == 'object');
}

module.exports = isPlainObject
