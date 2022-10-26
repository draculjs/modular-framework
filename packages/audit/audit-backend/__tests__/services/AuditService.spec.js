import mongoHandler from '../utils/mongo-handler';
import { createAudit } from '../../src/services/AuditService.js'

describe("AuditService", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })


    test('user action gets written into the database', async () => {

    }, 2000)
})