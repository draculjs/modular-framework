import mongoHandler from '../utils/mongo-handler'
import {mongoose} from '@dracul/common-backend'

import { createAudit } from '../../src/services/AuditService.js'
import Audit from '../../src/models/AuditModel.js'

const id = mongoose.Types.ObjectId()
const user = {id}

describe("AuditService", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })


    test('Audit gets registered in DB (createAudit)', async () => {
        await createAudit(user, {user: user.id, action:'Testing', resource: 'audit module', description:'(using jest)'})
        const auditFound = await Audit.findOne({user: id})

        expect(auditFound.user).toEqual(id)
        expect(auditFound.action).toBe('Testing')
        expect(auditFound.resource).toBe('audit module')
        expect(auditFound.description).toBe('(using jest)')

    }, 2000)

    test('createAudit() should notify when needed parameters are not passed', async () => {

        await expect(createAudit(user, {description:'(using jest)'})).rejects.toThrow('Audit validation failed')

    }, 2000)
})