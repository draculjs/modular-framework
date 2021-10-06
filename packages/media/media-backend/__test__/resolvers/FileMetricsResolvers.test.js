const mongoHandler = require('../../__test__/utils/mongo-handler');

import initService from '../../src/init/init-service';
import {UserService} from "@dracul/user-backend";
import { RoleService } from '@dracul/user-backend';
import { rbac } from '@dracul/user-backend';
import FileMetricsResolvers from '../../src/modules/media/graphql/resolvers/FileMetricsResolvers';
import path from 'path';
import uploadFileSimulator from '../utils/uploadFileSimulator';
import fileUpload from '../../src/modules/media/services/UploadService';


describe("FileMetricsResolvers", () => {


    beforeAll(async () => {
        await mongoHandler.connect()
        await initService()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('fileUserMetricsByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)

        const metrics = await FileMetricsResolvers.Query.fileUserMetrics(null, {}, {user, rbac:Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(metrics.length).toBe(1)
    });
    test('fileUserMetricsWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
     
        await expect(() => FileMetricsResolvers.Query.fileUserMetrics(null, {}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileUserMetricsWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        user = ""
        await expect(() => FileMetricsResolvers.Query.fileUserMetrics(null, {}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

    test('fileGlobalMetricsByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        const metrics = await FileMetricsResolvers.Query.fileGlobalMetrics(null, {}, {user, rbac:Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(metrics.count).toBe(1)
    });
    test('fileGlobalMetricsWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
     
        await expect(() => FileMetricsResolvers.Query.fileGlobalMetrics(null, {}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileGlobalMetricsWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        user = ""
        await expect(() => FileMetricsResolvers.Query.fileGlobalMetrics(null, {}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

})
