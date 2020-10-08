//Utils
const mongoHandler = require('../utils/mongo-handler');
import {tokenSignRecovery} from '../utils/tokenSign'

//Init DB
import {initPermissions,initAdminRole,initRootUser} from "../../src/services/InitService";

//Service to Test
import {validateToken} from "../../src/services/TokenService";

//Service dependencies
import {findUserByUsername} from "../../src/services/UserService";

describe("TokenService", () => {

    let connection;

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
    });

    afterAll(async  () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('Token Ok', async () => {

        let token = tokenSignRecovery(await findUserByUsername('root'))

        let result = await validateToken(token)
        expect(result).toHaveProperty('valid',true)
        expect(result).toHaveProperty('operation','recovery')


    });
})