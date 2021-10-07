const mongoHandler = require('../../__test__/utils/mongo-handler')

import {InitService} from "@dracul/user-backend"
import {initMediaPermissions} from '../../src/modules/media/services/InitMediaPermissions'
import {RoleService} from "@dracul/user-backend"

describe("storeFile", () => {

  beforeAll(async () => {
    await mongoHandler.connect()
    await InitService.initPermissions()
    await initMediaPermissions()
    await InitService.initAdminRole()
  });
  
  afterAll(async  () => {
    await mongoHandler.clearDatabase();
    await mongoHandler.closeDatabase();
  })
  
  test('Load custom permissions', async () => {
    let role = await RoleService.findRoleByName('admin')

    await expect(initMediaPermissions()).resolves.not.toBeNull()
    await expect(role.permissions).toContain('FILE_CREATE', 'FILE_DELETE', 'FILE_UPDATE', 'FILE_SHOW')
  })

})