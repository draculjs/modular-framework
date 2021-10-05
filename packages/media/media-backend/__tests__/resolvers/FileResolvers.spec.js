const mongoHandler = require('../utils/mongo-handler');

import initService from '../../src/init/init-service';
import {UserService} from "@dracul/user-backend";
import { UserRbacFactory } from '../rbac/RbacService';
import FileResolvers from "../../src/modules/media/graphql/resolvers/FileResolvers";
import fileUpload from '../../src/modules/media/services/UploadService';
import path from 'path'
import uploadFileSimulator from '../utils/uploadFileSimulator'

describe("FileResolvers", () => {


    beforeAll(async () => {
        await mongoHandler.connect()
        await initService()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('FileFindByAdmin', async () => {

        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const file = await FileResolvers.Query.fileFind(null, {id}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(file).toBe(null)
    });
    test('FileFindWithoutPermission', async () => {
      
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
     
        await expect(() => FileResolvers.Query.fileFind(null, {id}, {user, rbac}) ).toThrow('Not Authorized');
        
    });
    test('FileFindWithoutUser', async () => {
      
        const id = '6155cedb16336b05342db8b8'
        let user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        user = ""
        await expect(() => FileResolvers.Query.fileFind(null, {id}, {user, rbac}) ).toThrow('Unauthenticated');
        
    });

    test('filePaginateByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const files = await FileResolvers.Query.filePaginate(null, {pageNumber:1, itemsPerPage:5, search:"", orderBy:"", orderDesc:false}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(files.totalItems).toBe(0)
    });
    test('filePaginateWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
     
        await expect(() => FileResolvers.Query.filePaginate(null, {pageNumber:1, itemsPerPage:5, search:"", orderBy:"", orderDesc:false}, {user, rbac}) ).toThrow('Not Authorized');
        
    });
    test('filePaginateWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        user = ""
        await expect(() => FileResolvers.Query.filePaginate(null, {pageNumber:1, itemsPerPage:5, search:"", orderBy:"", orderDesc:false}, {user, rbac}) ).toThrow('Unauthenticated');
        
    });

    test('fileUpdateByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const rbac = await UserRbacFactory(user)
        const input = {description:"descripcion",tags:["tag"]}

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)
        const id = uploadedFile._id

        const secondfile = await FileResolvers.Mutation.fileUpdate(null, {id,input}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(secondfile.description).toBe("descripcion")
    });
    test('fileUpdateWithoutPermission', async () => {
        
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        const input = {description:"descrpcion",tags:["tag"]}

        await expect(() => FileResolvers.Mutation.fileUpdate(null, {id,input}, {user, rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileUpdateWithoutUser', async () => {

        const id = '6155cedb16336b05342db8b8'
        let user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        const input = {description:"descrpcion",tags:["tag"]}
        user = ""

        await expect(() => FileResolvers.Mutation.fileUpdate(null, {id,input}, {user, rbac}) ).toThrow('Unauthenticated');
        
    });

    test('fileDeleteByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)
        const id = uploadedFile._id

        const res = await FileResolvers.Mutation.fileDelete(null, {id}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(res.success).toBe(true)
    });
    test('fileDeleteWithoutPermission', async () => {
        
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)

        await expect(() => FileResolvers.Mutation.fileDelete(null, {id}, {user, rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileDeleteWithoutUser', async () => {

        const id = '6155cedb16336b05342db8b8'
        let user = await UserService.findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)
        user = ""

        await expect(() => FileResolvers.Mutation.fileDelete(null, {id}, {user, rbac}) ).toThrow('Unauthenticated');
        
    });

})
