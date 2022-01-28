export const baseUrl = function () {
    let url = process.env.APP_API_URL

    //Si no tiene http o https al inicio, lo agrega
    if (!/^http(s)?:\/\//.test(url)) {
        url = "http://" + url
    }

    if (!/\/$/.test(url)) {
        url += "/"
    }

    return url
}

export default baseUrl
