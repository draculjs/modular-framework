const mongoHandler = require('../utils/mongo-handler');

import initService from '../../src/init/init-service';
import {UserService} from "@dracul/user-backend";
import { RoleService } from '@dracul/user-backend';
import { rbac } from '@dracul/user-backend';
import path from 'path';
import uploadFileSimulator from '../utils/uploadFileSimulator';
import UploadResolvers from '../../src/modules/media/graphql/resolvers/UploadResolvers';


describe("FileMetricsResolvers", () => {


    beforeAll(async () => {
        await mongoHandler.connect()
        await initService()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('fileUploadByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        const file = uploadFileSimulator(filePath)

        const uploadedFile = await UploadResolvers.Mutation.fileUpload(null, {file}, {user, rbac:Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(uploadedFile.type).toBe("image")
    });
    test('fileUploadWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulatedFile = uploadFileSimulator(filePath)

        await expect(() => UploadResolvers.Mutation.fileUpload(null, {simulatedFile}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileUploadWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        user = ""

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulatedFile = uploadFileSimulator(filePath)

        await expect(() => UploadResolvers.Mutation.fileUpload(null, {simulatedFile}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

})
