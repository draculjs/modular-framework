import request from 'supertest'
import app from '../../../../src/index'
import mongoHandler from "../../../utils/mongo-handler"
import {AuthService, UserService,InitService} from "@dracul/user-backend";
import path from "path";
import uploadFileSimulator from "../../../utils/uploadFileSimulator";
import fileUpload from "../../../../src/modules/media/services/UploadService";


describe("media routes", () => {

    let token;

    beforeAll(async () => {
        await mongoHandler.connect()
        await InitService.initPermissions()
        await InitService.initAdminRole()
        await InitService.initRootUser()
        let user = await UserService.findUserByUsername("root")
        token = AuthService.apiKey(user._id)

    })

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    describe("/api/file method GET", () => {

        it("get all files OK", async (done) => {

            let user = await UserService.findUserByUsername("root")
            token = AuthService.apiKey(user._id)

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

            let pageNumber = 1
            let itemsPerPage = 10
            let search = null
            let orderBy = null
            let orderDesc = null

            const res = await request(app)
                .get("/api/file")
                .auth(token, { type: 'Bearer' })
                .query({pageNumber,itemsPerPage,search,orderBy,orderDesc})

            console.log("RESPONSE : ",res.body)

            expect(res.type).toEqual("application/json")
            expect(res.body).not.toBeNull()
            expect(res.body.length).toEqual(itemsPerPage)
            expect(res.body[0]).toEqual(expect.objectContaining({
                filename: expect.any(String),
                mimetype: expect.any(String),
                encoding: expect.any(String),
                extension: expect.any(String),
                type: expect.any(String),
                relativePath: expect.any(String),
                url: expect.any(String),
                createdAt: expect.any(Date)
            }));
            expect(res.status).toBe(200)
            done()

        },12000);

        /*it("get 5 items per page when itemsPerPage not given" , async (done) => {

            let pageNumber = 1

            const res = await request(app)
                .get("/api/file")
                .set("x-access-token", "Bearer "+token)
                .query({pageNumber})

            expect(res.type).toEqual("application/json")
            expect(res.body.length).toEqual(5);
            expect(res.status).toBe(200);
            expect(res.body[0]).toEqual(expect.objectContaining({
                filename: expect.any(String)}));
            done();
        }, 12000)

        it("get 5 items, one page, order asc, when not receive any parameters",  async(done) => {

            const res = await request(app)
                .get("/api/file")
                .set("x-access-token", "Bearer "+token)

            expect(res.type).toEqual("application/json")
            expect(res.body.length).toEqual(5);
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

        }, 15000)*/
    })

})