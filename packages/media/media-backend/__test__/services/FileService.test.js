const mongoHandler = require('../utils/mongo-handler')

import {InitService} from "@dracul/user-backend"
import {findFile, fetchFiles, paginateFiles, updateFile, deleteFile} from '../../src/modules/media/services/FileService'
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


  test('Find file is not null', async () => {
    await expect(findFile(createFileOne._id)).resolves.not.toBeNull()
  })

  test('Find file without id error', async () => {
    await expect(findFile()).rejects.toThrow(Error)
  })

  test('Not find file error', async () => {
    await expect(findFile("6p20dpbj49cSdgxA")).rejects.toThrow(Error)
  })

  test('Fetch files is not null', async () => {
    await expect(fetchFiles()).resolves.not.toBeNull()
  })

  test('fetch files', async () => {
    let files = await fetchFiles()
    expect(files.length).toBe(3)
  })

  test('fetch files with params', async () => {
    const valor1 = 8
    const valor2 = 'prueba'
    const valor3 = true
    await expect(fetchFiles(valor1, valor2, valor3)).resolves.not.toBeNull()
  })


  test('Paginate files', () => {
    expect(paginateFiles({pageNumber: 1, itemsPerPage:5})).not.toBeNull()
  })

  test('Update file', async () => {
    await expect(updateFile(null, createFileOne._id, {description: "description", tags: []})).resolves.not.toBeNull()
  })

  test('Delete file', async () => {
    await expect(deleteFile(createFileOne._id)).resolves.toEqual({id: createFileOne._id, success: true})
  })

})
