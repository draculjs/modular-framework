//Utils
import {initAdminRole, initPermissions, initRootUser} from "../../src/services/InitService";

import {avatarUpload} from "../../src/services/ProfileService";

const mongoHandler = require('../utils/mongo-handler');

import uploadFileSimulator from '../utils/uploadFileSimulator'
import {findUserByUsername} from "../../src/services/UserService";
import path from 'path'

describe("ProfileServiceTest", () => {


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



    test('Avatar Upload Success', async () => {

        let user = await findUserByUsername('root')
        let filePath = path.join(__dirname,'../assets/','VladDracul.png')
        let file = uploadFileSimulator(filePath)


        await expect(avatarUpload(user, file)).resolves.toHaveProperty('filename','VladDracul.png')

        let userUpdated = await findUserByUsername('root')


        expect (userUpdated.avatar).toEqual("root.png")

    });

    test('Avatar Upload Validation size Fail', async () => {
        let user = await findUserByUsername('root')
        let filePath = path.join(__dirname,'../assets/','big.png')
        let file = uploadFileSimulator(filePath)

        await expect(avatarUpload(user, file)).rejects.toThrow('MAX_FILE_SIZE_EXCEEDED')

    });

    test('Avatar Upload Validation mimetype Not Allowed', async () => {
        let user = await findUserByUsername('root')
        let filePath = path.join(__dirname,'../assets/','Dracul.pdf')
        let file = uploadFileSimulator(filePath)

        await expect(avatarUpload(user, file)).rejects.toThrow("MIMETYPE_NOT_ALLOWED")

        let userUpdated = await findUserByUsername('root')


        expect (userUpdated.avatar).not.toEqual("root.pdf")

    });



})