const mongoHandler = require('../utils/mongo-handler')

import {InitService} from "@dracul/user-backend"
import {fileUpload} from '../../src/modules/media/services/UploadService'
import {UserService} from "@dracul/user-backend"
import {RoleService} from "@dracul/user-backend"
import uploadFileSimulator from "../utils/uploadFileSimulator"
import path from 'path'

describe("storeFile", () => {

  beforeAll(async () => {
    await mongoHandler.connect()
    await InitService.initPermissions()
    await InitService.initAdminRole()
    await InitService.initRootUser()
  });
  
  afterAll(async  () => {
    await mongoHandler.clearDatabase();
    await mongoHandler.closeDatabase();
  })
  
  test('File upload', async () => {
    let role = await RoleService.findRoleByName('admin')
    let userDoc = { username: 'jrambo', email: 'jrambo@gmail.com', name: 'Jhon Rambo', password: '123', role:  role.id }
    let user = await UserService.createUser(userDoc, null)
    
    let filePath = path.join(__dirname,'../assets/','prueba.jpeg')
    let file = uploadFileSimulator(filePath)

    await expect(fileUpload(user, file)).resolves.not.toBeNull()
  })

  test('File upload without params', async () => {
    await expect(fileUpload()).rejects.toThrow('Upload Fail')
  })

})