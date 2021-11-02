export const convertGigabytesToBytes = function (fileSizeInGigabyte) {
    return fileSizeInGigabyte * 1024 * 1024 * 1024;
}

export default convertGigabytesToBytes
