const mongoHandler = require('../utils/mongo-handler')

import {InitService} from "@dracul/user-backend"
import {fileGlobalMetrics, fileUserMetrics} from '../../src/modules/media/services/FileMetricsService'
import {fileUpload} from '../../src/modules/media/services/UploadService'
import {UserService} from "@dracul/user-backend"
import {RoleService} from "@dracul/user-backend"
import uploadFileSimulator from "../utils/uploadFileSimulator"
import path from 'path'

describe("storeFile", () => {

  let createFileOne
  let createFileTwo
  let createFileThree

  beforeAll(async () => {
    await mongoHandler.connect()
    await InitService.initPermissions()
    await InitService.initAdminRole()
    await InitService.initRootUser()
    
    let role = await RoleService.findRoleByName('admin')
    let userDoc = { username: 'jrambo', email: 'jrambo@gmail.com', name: 'Jhon Rambo', password: '123', role:  role.id }
    const user = await UserService.createUser(userDoc, null)
    
    let filePath = path.join(__dirname,'../assets/','prueba.jpeg')
    let file = uploadFileSimulator(filePath)

    createFileOne = await fileUpload(user, file)
    createFileTwo = await fileUpload(user, file)
    createFileThree = await fileUpload(user, file)
  });
  
  afterAll(async  () => {
    await mongoHandler.clearDatabase();
    await mongoHandler.closeDatabase();
  })
  
  test('File global metrics', async () => {
    await expect(fileGlobalMetrics()).resolves.not.toBeNull()
    await expect(fileGlobalMetrics()).resolves.toEqual({_id: "global", count: 3, weight: 27315})
  })

  test('File user metrics', async () => {
    await expect(fileUserMetrics()).resolves.not.toBeNull()
    await expect(fileUserMetrics()).resolves.toEqual([{"_id": {"user": "jrambo"}, "count": 3, "user": "jrambo", "weight": 27315}])
  })

})