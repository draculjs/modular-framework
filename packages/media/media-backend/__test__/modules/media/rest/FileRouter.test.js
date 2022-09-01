import request from 'supertest'
import app from '../../../../src/index'
import mongoHandler from "../../../utils/mongo-handler"
import { AuthService, UserService, InitService } from "@dracul/user-backend";
import uploadMultiFiles from "../../../utils/uploadMultiFilesSimulator";
import { fetchFiles } from "../../../../src/modules/media/services/FileService";
import path from "path";


describe("media routes", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
        await InitService.initPermissions(['FILE_SHOW_ALL', 'FILE_CREATE_ALL', 'FILE_UPDATE_ALL'])
        await InitService.initAdminRole()
        await InitService.initRootUser()
    })

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    describe("GET /api/file", () => {

        beforeAll(async () => {
            let user = await UserService.findUserByUsername("root")
            await uploadMultiFiles(user)
        })

        it("get all files OK", async (done) => {

            let user = await UserService.findUserByUsername("root")
            let { token } = await AuthService.apiKey(user._id)

            let pageNumber = 1
            let itemsPerPage = 6
            let search = null
            let orderBy = null
            let orderDesc = null

            const res = await request(app)
                .get("/api/file")
                .set('Authorization', 'Bearer ' + token)
                .query({ pageNumber, itemsPerPage, search, orderBy, orderDesc })

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

        });

        it("get 5 items per page when itemsPerPage not given", async (done) => {

            let user = await UserService.findUserByUsername("root")
            let { token } = await AuthService.apiKey(user._id)

            let pageNumber = 1

            const res = await request(app)
                .get("/api/file")
                .set('Authorization', 'Bearer ' + token)
                .query({ pageNumber })

            expect(res.type).toEqual("application/json")
            expect(res.body).not.toBeNull()
            expect(res.body).toHaveProperty("items")
            expect(res.body.items.length).toEqual(5);
            expect(res.status).toBe(200);
            done();
        })

        it("get 5 items, one page, when not receive any parameters", async (done) => {

            let user = await UserService.findUserByUsername("root")
            let { token } = await AuthService.apiKey(user._id)

            const res = await request(app)
                .get("/api/file")
                .set('Authorization', 'Bearer ' + token)

            expect(res.type).toEqual("application/json")
            expect(res.body).toHaveProperty("items")
            expect(res.body.items.length).toEqual(5);
            expect(res.body).toEqual(expect.objectContaining({
                items: expect.any(Array),
                totalItems: expect.any(Number),
                page: expect.any(Number)
            }));
            expect(res.status).toBe(200);
            done();
        })

        it("invalid or non-existent token", async (done) => {

            const res = await request(app)
                .get("/api/file")

            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(401);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty("message")
            expect(res.body).toEqual({ "message": "Not Authorized" })
            done();

        })

    })

    describe("GET /api/file/:id", () => {

        beforeAll(async () => {
            let user = await UserService.findUserByUsername("root")
            await uploadMultiFiles(user)
        })

        it("get a file by id OK", async (done) => {

            let user = await UserService.findUserByUsername("root")
            let { token } = await AuthService.apiKey(user._id)

            let files = await fetchFiles()
            let id = files[0]._id

            const res = await request(app)
                .get("/api/file/" + id)
                .set('Authorization', 'Bearer ' + token)

            expect(res.type).toEqual("application/json")
            expect(res.body).not.toBeNull()
            expect(res.body).toHaveProperty("_id")
            expect(res.status).toBe(200);
            done();
        })

        it("id doesn't belong to any file, so it doesn't return anything", async (done) => {

            let id = "sdfsdfsde454"

            let user = await UserService.findUserByUsername("root")
            let { token } = await AuthService.apiKey(user._id)

            const res = await request(app)
                .get("/api/file/" + id)
                .set('Authorization', 'Bearer ' + token)

            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(200);
            expect(res.body).toBe(null);
            done()
        })

        it("invalid or non-existent token", async (done) => {

            let id = "asdasdasr45"

            const res = await request(app)
                .get("/api/file/" + id)

            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(401);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty("message")
            expect(res.body).toEqual({ "message": "Not Authorized" })
            done();
        })

    });

    describe("POST /api/file", () => {

        it("file upload successfully", async (done) => {

            let user = await UserService.findUserByUsername("root")
            let { token } = await AuthService.apiKey(user._id)

            let filePath = path.join(__dirname, "../../../assets/imageone.png")

            const res = await request(app)
                .post("/api/file")
                .attach("file", filePath)
                .set('Authorization', 'Bearer ' + token)

            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(201);
            expect(res.body).not.toBeNull();
            expect(res.body).toEqual(expect.objectContaining({
                __v: expect.any(Number),
                _id: expect.any(String),
                filename: expect.any(String),
                type: expect.any(String),
                extension: expect.any(String),
                relativePath: expect.any(String),
                absolutePath: expect.any(String),
                size: expect.any(Number),
                url: expect.any(String),
                createdBy: expect.any(Object),
                createdAt: expect.any(String),
                deleted: expect.any(Boolean),
                deletedAt: null,
                encoding: expect.any(String),
                mimetype: expect.any(String),
                tags: expect.any(Array)
            }))

            done()

        })

        it("invalid or non-existent token", async (done) => {

            const res = await request(app)
                .post("/api/file")

            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(401);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty("message")
            expect(res.body).toEqual({ "message": "Not Authorized" })
            done();
        })

    })

})
