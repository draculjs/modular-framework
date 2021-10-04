import request from 'supertest'
import app from '../../../../src/index'
import mongoHandler from "../../../utils/mongo-handler"
import {AuthService, UserService,InitService} from "@dracul/user-backend";

describe("media routes", () => {

    let token;

    beforeAll(async () => {
        await mongoHandler.connect()
        await InitService.initPermissions()
        await InitService.initAdminRole()
        await InitService.initRootUser()
        let {_id} = UserService.findUserByUsername("root")
        token = AuthService.apiKey(_id)
    })

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })


    describe("/file method GET", () => {

        it("get all files OK", async (done) => {

            let pageNumber = 1
            let itemsPerPage = 10
            let search = null
            let orderBy = null
            let orderDesc = null

            const res = await request(app)
                .get("/file")
                .set("x-access-token", token)
                .query({pageNumber,itemsPerPage,search,orderBy,orderDesc})

            expect(res.type).toEqual("application/json")
            expect(res.body.length).toEqual(itemsPerPage);
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
            expect(res.status).toBe(200);
            done();

        },12000);

        it("get 5 items per page when itemsPerPage not given" , async (done) => {

            let pageNumber = 1

            const res = await request(app)
                .get("/file")
                .set("x-access-token", token)
                .query({pageNumber})

            expect(res.type).toEqual("application/json")
            expect(res.body.length).toEqual(5);
            expect(res.status).toBe(200);
            expect(res.body[0]).toEqual(expect.objectContaining({
                filename: expect.any(String)}));
            done();
        }, 12000)

        it("get 5 items, one page, order asc, when not receive any parameters",  async() => {

            const res = await request(app)
                .get("/file")
                .set("x-access-token", token)

            expect(res.type).toEqual("application/json")
            expect(res.body.length).toEqual(5);
            expect(res.status).toBe(200);
        })

        it("token expired", async () => {

            const tokenFake = "fsdafasdarer"

            const res = await request(app)
                .get("/file")
                .set("x-access-token", tokenFake)
            expect(res.type).toEqual("application/json")
            expect(res.status).toBe(401);
            expect(res.body).not.toBeNull();
            expect(res.body).toHaveProperty("message")
            expect(res.body).toEqual({"message": "Not Authorized"})

        })
    })

})