export const baseUrl = function () {
    let url = process.env.APP_API_URL

    if (!/^http:\/\//.test(url)) {
        url = "http://" + baseUrl
    }

    if (!/\/$/.test(url)) {
        url += "/"
    }

    return url
}

export default baseUrl
