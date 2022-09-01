import { getSettingsValueByKey} from "../services/SettingsService";

class SettingCacheManager{

    constructor() {
        this.settings = {}
    }

    getTimestampInSeconds () {
        return Math.floor(Date.now() / 1000)
    }

    setSetting(key, value, ttl = 60){
        let setting = {
            key: key,
            value: value,
            ttl: ttl,
            expiration: this.getTimestampInSeconds() + ttl
        }
        this.settings[key] = setting
    }

    async getSettingValue(key,ttl){
        if(this.isCached(key)){
            return this.settings[key].value
        }

       return await this.getSettingValueFromDb(key,ttl)

    }

    hasSetting(key){
        return !!this.settings[key]
    }

    isCached(key){
        if(!this.hasSetting(key)) return false
        if( this.settings[key].expiration > this.getTimestampInSeconds() ){
            return true
        }else{
            this.clearCache(key)
            return false
        }
    }

    clearCache(key){
        delete this.settings[key]
    }

    async getSettingValueFromDb(key,ttl){
        let value = await getSettingsValueByKey(key)
        if(value){
            this.setSetting(key, value, ttl)
        }
        return value
    }

}

const cache = new SettingCacheManager()

export const SettingCache = async (key,ttl) => {
    return await cache.getSettingValue(key,ttl)
}

export default SettingCache
