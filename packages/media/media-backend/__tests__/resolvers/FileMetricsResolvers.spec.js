const mongoHandler = require('../utils/mongo-handler');

import initService from '../../src/init/init-service';
import {UserService} from "@dracul/user-backend";
import { UserRbacFactory } from '../rbac/RbacService';
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
        const rbac = await UserRbacFactory(user)

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)

        const metrics = await FileMetricsResolvers.Query.fileUserMetrics(null, {}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(metrics.length).toBe(1)
    });
    test('fileUserMetricsWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
     
        await expect(() => FileMetricsResolvers.Query.fileUserMetrics(null, {}, {user, rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileUserMetricsWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        user = ""
        await expect(() => FileMetricsResolvers.Query.fileUserMetrics(null, {}, {user, rbac}) ).toThrow('Unauthenticated');
        
    });

    test('fileGlobalMetricsByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const metrics = await FileMetricsResolvers.Query.fileGlobalMetrics(null, {}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(metrics.count).toBe(1)
    });
    test('fileGlobalMetricsWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
     
        await expect(() => FileMetricsResolvers.Query.fileGlobalMetrics(null, {}, {user, rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileGlobalMetricsWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        user = ""
        await expect(() => FileMetricsResolvers.Query.fileGlobalMetrics(null, {}, {user, rbac}) ).toThrow('Unauthenticated');
        
    });

})
