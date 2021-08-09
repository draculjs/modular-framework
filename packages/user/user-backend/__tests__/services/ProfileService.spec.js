//Utils
import {initAdminRole, initPermissions, initRootUser} from "../../src/services/InitService";

import {avatarUpload, changePassword} from "../../src/services/ProfileService";

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


    test('Current password and new password are null or empty', async () => {
      let currentPass = ''
      let newPass = null
      let user = await findUserByUsername('root')
      expect(changePassword(user.id, currentPass, newPass)).rejects.toThrow({message: "Current password and new password must not be null or empty"})
    })
    
    test('Current password equal new password', async () => {
      let currentPass = 'root.123'
      let newPass = 'root.123'
      let user = await findUserByUsername('root')
      expect(changePassword(user.id, currentPass, newPass)).rejects.toThrow(Error)
    })
    
    test('Current password unequal new password', async () => {
      let currentPass = 'root.123'
      let newPass = '12345'
      let user = await findUserByUsername('root')
      expect(changePassword(user.id, currentPass, newPass)).resolves.toBe({status: true, message: "Password Changed"})
    })
})
