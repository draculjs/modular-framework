const mongoHandler = require('../utils/mongo-handler')

import { initService } from "../../src/init/init-service";
import { fileUpload } from '../../src/modules/media/services/UploadService'
import { findFile, deleteFile, findAndDeleteExpiredFiles } from '../../src/modules/media/services/FileService'
import { createUserStorage, findUserStorageByUser, updateUserUsedStorage } from '../../src/modules/media/services/UserStorageService'
import { UserService, RoleService } from "@dracul/user-backend"
import uploadFileSimulator from "../utils/uploadFileSimulator"
import path from 'path'
import { rbac } from '@dracul/user-backend'
import {
  FILE_DELETE_ALL,
  FILE_DELETE_OWN
} from "../../src/modules/media/permissions/File";


describe("UserStorageService", () => {

  let user;
  let Rbac;

  beforeAll(async () => {
    await mongoHandler.connect()
    await initService()

    // Busco usuario root existente y sus permisos
    user = await UserService.findUserByUsername('root');

    const roles = await RoleService.findRoles();
    Rbac = new rbac(roles);
    Rbac.addUserRoles(user.id, [user.role.name]);

    // Creo userStorage para el root
    const capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
    const usedSpace = 0;
    const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES ? process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES  : 0 ;
    const fileExpirationTime = 0;
    const deleteByLastAccess = true;
    const deleteByCreatedAt = false;
    await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt)

  });

  afterAll(async () => {
    await mongoHandler.clearDatabase();
    await mongoHandler.closeDatabase();
  })

  test('Delete file by last access', async () => {
    // Actualizo el user storage para probar la eliminación de archivos por last access.
    let userStorage = await findUserStorageByUser(user);
    userStorage.deleteByLastAccess = true;
    userStorage.deleteByCreatedAt = false;
    userStorage.save();

    // Creo archivo para ese usuario
    const filePath = path.join(__dirname, '../assets/', 'prueba.jpeg')
    const file = uploadFileSimulator(filePath)
    const doc = await fileUpload(user, file)

    const success = await findAndDeleteExpiredFiles();
    await expect(success.deletedCount).toBe(1);
  })

  test('Delete file by created at', async () => {
    // Actualizo el user storage para probar la eliminación de archivos por last access.
    let userStorage = await findUserStorageByUser(user);
    userStorage.deleteByLastAccess = false;
    userStorage.deleteByCreatedAt = true;
    userStorage.save();

    // Creo archivo para ese usuario
    const filePath = path.join(__dirname, '../assets/', 'prueba.jpeg')
    const file = uploadFileSimulator(filePath)
    const doc = await fileUpload(user, file)

    const success = await findAndDeleteExpiredFiles();
    await expect(success.deletedCount).toBe(1);
  })

  test('Not upload file if its size exceeds the maximum file capacity', async () => {
    const filePath = path.join(__dirname, '../assets/', 'imagen-pesada.jpg')
    const file = uploadFileSimulator(filePath)
    await expect(fileUpload(user, file)).rejects.toThrow(new Error("MAX_FILE_SIZE_EXCEEDED"))
  })

  test('Update user storage after a file was uploaded', async () => {
    // Creo archivo nuevo
    const filePath = path.join(__dirname, '../assets/', 'prueba.jpeg')
    const file = uploadFileSimulator(filePath)
    const doc = await fileUpload(user, file)

    // Actualizo used space en el modelo de UserStorage del usuario
    const updatedUserStorage = await updateUserUsedStorage(user._id, doc.size)
    await expect(updatedUserStorage.usedSpace).toBeGreaterThan(0);

    // Borro el archivo
    let permissionType = (Rbac.isAllowed(user.id, FILE_DELETE_ALL)) ? FILE_DELETE_ALL : (Rbac.isAllowed(user.id, FILE_DELETE_OWN)) ? FILE_DELETE_OWN : null;
    await deleteFile(doc._id, permissionType, user._id)

    await expect(findFile(doc._id, permissionType, user._id)).resolves.toBeNull()
  })

  test('Create user storage after user is created', async () => {

    // Creo un rol y usuario
    let role = await RoleService.findRoleByName('uploader')
    let userDoc = {
      username: 'jmcclane',
      email: 'jmcclane@gmail.com',
      name: 'John Mcclane',
      password: '123',
      role: role.id
    }
    const user = await UserService.createUser(userDoc, null);

    // Espero a que se lance el evento de creación de user despues de 2 segundos
    setTimeout(async () => {
      const userStorage = await findUserStorageByUser(user);
      await expect(findUserStorageByUser(userStorage)).resolves.toHaveProperty('usedSpace', 0);
    }, 2000);

  })

})
