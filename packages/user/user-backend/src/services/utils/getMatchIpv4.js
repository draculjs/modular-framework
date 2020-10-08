export default function(ip){
    if(ip === '::1'){
        return '127.0.0.1'
    }
    return ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0]
}
