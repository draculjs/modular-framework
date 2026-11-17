import {expect} from 'chai'
import Settings from '../../src/models/SettingsModel'

describe('Settings rich text types', () => {
    for (const [type, value] of [['html', '<p>Contenido</p>'], ['markdown', '# Contenido']]) {
        it(`accepts ${type} and preserves its value as a string`, () => {
            const setting = new Settings({key: `editor-${type}`, group: 'editors', type, value})
            expect(setting.validateSync()).to.equal(undefined)
            expect(setting.toObject().value).to.equal(value)
            expect(setting.toObject().value).to.be.a('string')
        })
    }
})
