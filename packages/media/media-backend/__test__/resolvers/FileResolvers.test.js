const mongoHandler = require('../../__test__/utils/mongo-handler');

import initService from '../../src/init/init-service';
import {UserService} from "@dracul/user-backend";
import { RoleService } from '@dracul/user-backend';
import { rbac } from '@dracul/user-backend';
import FileResolvers from "../../src/modules/media/graphql/resolvers/FileResolvers";
import fileUpload from '../../src/modules/media/services/UploadService';
import path from 'path'
import uploadFileSimulator from '../../__test__/utils/uploadFileSimulator'

describe("FileResolvers", () => {


    beforeAll(async () => {
        await mongoHandler.connect()
        await initService()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })
    
    
    test('FileFindByAdminEmpty', async () => {
        
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("root")
        
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        
        const file = await FileResolvers.Query.fileFind(null, {id}, {user, rbac: Rbac})
        
        //Total items must be 3 for default users: root, supervisor, operator
        expect(file).toBe(null)
    });
    test('FileFindByAdmin', async () => {
        
        
        const user = await UserService.findUserByUsername("root")
        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)
        const id = uploadedFile._id
        
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        
        const file = await FileResolvers.Query.fileFind(null, {id}, {user, rbac: Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(file.filename).toBe(uploadedFile.filename)
    });
    test('FileFindWithoutPermission', async () => {
      
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
     
        await expect(() => FileResolvers.Query.fileFind(null, {id}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('FileFindWithoutUser', async () => {
      
        const id = '6155cedb16336b05342db8b8'
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        user = ""
        await expect(() => FileResolvers.Query.fileFind(null, {id}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

    test('filePaginateByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        const files = await FileResolvers.Query.filePaginate(null, {pageNumber:1, itemsPerPage:5, search:"", orderBy:"", orderDesc:false}, {user, rbac:Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(files.totalItems).toBe(1)
    });
    test('filePaginateWithoutPermission', async () => {
      
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
     
        await expect(() => FileResolvers.Query.filePaginate(null, {pageNumber:1, itemsPerPage:5, search:"", orderBy:"", orderDesc:false}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('filePaginateWithoutUser', async () => {
      
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        user = ""
        await expect(() => FileResolvers.Query.filePaginate(null, {pageNumber:1, itemsPerPage:5, search:"", orderBy:"", orderDesc:false}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

    test('fileUpdateByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        const input = {description:"descripcion",tags:["tag"]}

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)
        const id = uploadedFile._id

        const secondfile = await FileResolvers.Mutation.fileUpdate(null, {id,input}, {user, rbac:Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(secondfile.description).toBe("descripcion")
    });
    test('fileUpdateWithoutPermission', async () => {
        
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        const input = {description:"descrpcion",tags:["tag"]}

        await expect(() => FileResolvers.Mutation.fileUpdate(null, {id,input}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileUpdateWithoutUser', async () => {

        const id = '6155cedb16336b05342db8b8'
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        const input = {description:"descrpcion",tags:["tag"]}
        user = ""

        await expect(() => FileResolvers.Mutation.fileUpdate(null, {id,input}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

    test('fileDeleteByAdmin', async () => {

        const user = await UserService.findUserByUsername("root")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        let filePath = path.join(__dirname,'../assets/','prueba.png')
        let simulateFfile = uploadFileSimulator(filePath)
        let uploadedFile = await fileUpload(user,simulateFfile)
        const id = uploadedFile._id

        const res = await FileResolvers.Mutation.fileDelete(null, {id}, {user, rbac:Rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(res.success).toBe(true)
    });
    test('fileDeleteWithoutPermission', async () => {
        
        const id = '6155cedb16336b05342db8b8'
        const user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])

        await expect(() => FileResolvers.Mutation.fileDelete(null, {id}, {user, rbac:Rbac}) ).toThrow('Not Authorized');
        
    });
    test('fileDeleteWithoutUser', async () => {

        const id = '6155cedb16336b05342db8b8'
        let user = await UserService.findUserByUsername("supervisor")
        const roles = await RoleService.findRoles()
        let Rbac = new rbac(roles)
        Rbac.addUserRoles(user.id, [user.role.name])
        user = ""

        await expect(() => FileResolvers.Mutation.fileDelete(null, {id}, {user, rbac:Rbac}) ).toThrow('Unauthenticated');
        
    });

})
