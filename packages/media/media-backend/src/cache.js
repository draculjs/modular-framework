import { Cache } from "@dracul/common-backend"
const mediaCache = new Cache(process.env.MEDIA_CACHE_TTL)
export { mediaCache }
export default mediaCache
