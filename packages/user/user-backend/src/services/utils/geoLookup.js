import geoip from "geoip-lite";

export default function geoLookup(ip) {
    let geo = {}
    if (ip === '127.0.0.1' || ip === '::1' ) {
        geo = {country: 'AR', region: 'Local', city: 'Local', timezone: ''}
    } else {
        geo = geoip.lookup(ip)
    }
    return geo;
}
