import request from 'supertest'
import app from '../../../../src/index'
import mongoHandler from "../../../utils/mongo-handler"
import {AuthService, UserService,InitService} from "@dracul/user-backend";
import path from "path";
import uploadFileSimulator from "../../../utils/uploadFileSimulator";
import fileUpload from "../../../../src/modules/media/services/UploadService";


describe("media routes", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
        await InitService.initPermissions(['FILE_SHOW', 'FILE_CREATE', 'FILE_UPDATE'])
        await InitService.initAdminRole()
        await InitService.initRootUser()
    })

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    describe("/api/file method GET", () => {

        beforeAll(async () => {

            let user = await UserService.findUserByUsername("root")

            let filesPath = ['../../../assets/imageone.png','../../../assets/imagetwo.png',
                '../../../assets/imagethree.jpeg',
                '../../../assets/imagefour.jpg',
                '../../../assets/imagefive.jpg',
                '../../../assets/imagesix.jpg']
            let index = 0
            let filePath;
            let file;

            while(index < filesPath.length){
                filePath = path.join(__dirname,filesPath[index])
                file = uploadFileSimulator(filePath)
                await fileUpload(user, file)
                index++
            }
        })

        it("get all files OK", async (done) => {

            let user = await UserService.findUserByUsername("root")
            let {token} = await AuthService.apiKey(user._id)

            let pageNumber = 1
            let itemsPerPage = 6
            let search = null
            let orderBy = null
            let orderDesc = null

            const res = await request(app)
                .get("/api/file")
                .set('Authorization','Bearer '+token)
                .query({pageNumber,itemsPerPage,search,orderBy,orderDesc})

            expect(res.type).toEqual("application/json")
            expect(res.body).not.toBeNull()
            expect(res.body).toHaveProperty("items")
            expect(res.body.items.length).toEqual(itemsPerPage)
            expect(res.body).toEqual(expect.objectContaining({
                items: expect.any(Array),
                totalItems: expect.any(Number),
                page: expect.any(Number)
            }));
            expect(res.status).toBe(200)
            done()

        },12000);

        it("get 5 items per page when itemsPerPage not given" , async (done) => {

            let user = await UserService.findUserByUsername("root")
            let {token} = await AuthService.apiKey(user._id)

            let pageNumber = 1

            const res = await request(app)
                .get("/api/file")
                .set('Authorization','Bearer '+token)
                .query({pageNumber})

            expect(res.type).toEqual("application/json")
            expect(res.body).not.toBeNull()
            expect(res.body).toHaveProperty("items")
            expect(res.body.items.length).toEqual(5);
            expect(res.status).toBe(200);
            done();
        }, 12000)

        it("get 5 items, one page, order asc, when not receive any parameters",  async(done) => {

            let user = await UserService.findUserByUsername("root")
            let {token} = await AuthService.apiKey(user._id)

            const res = await request(app)
                .get("/api/file")
                .set('Authorization','Bearer '+token)

            expect(res.type).toEqual("application/json")
            expect(res.body).toHaveProperty("items")
            expect(res.body.items.length).toEqual(5);
            expect(res.status).toBe(200);
            done();
        })

        it("token expired", async (done) => {

            let tokenFake = "asdkjaslkewaedasdaw"

            const res = await request(app)
                .get("/api/file")
                .set("x-access-token", tokenFake)

            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(401);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty("message")
            expect(res.body).toEqual({"message": "Not Authorized"})
            done();

        }, 15000)
    })

    

})