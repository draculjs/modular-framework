import index from './routes'
import store from './store/UserModule'

const userModule = {
    store: store,
    routes: index,
    gqlc: null,
    setGqlc(gqlc){
        this.gqlc = gqlc
    }
}

export default userModule;

export const gqlc = userModule.gqlc