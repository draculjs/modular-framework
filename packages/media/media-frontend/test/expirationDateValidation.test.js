/* eslint-env mocha */

const assert = require('assert')
const {isExpirationDateInPast} = require('../src/utils/expirationDateValidation')

describe('expirationDateValidation', () => {
  const now = new Date('2026-05-07T16:00:00.000Z')

  it('marks an expiration from earlier today as past', () => {
    const oneMinuteAgo = new Date('2026-05-07T15:59:00.000Z')

    assert.strictEqual(isExpirationDateInPast(oneMinuteAgo, now), true)
  })

  it('allows an expiration later today', () => {
    const laterToday = new Date('2026-05-07T23:00:00.000Z')

    assert.strictEqual(isExpirationDateInPast(laterToday, now), false)
  })

  it('allows an expiration from tomorrow even if it is less than 24 hours away', () => {
    const tomorrowMorning = new Date('2026-05-08T10:00:00.000Z')

    assert.strictEqual(isExpirationDateInPast(tomorrowMorning, now), false)
  })

  it('allows explicit expiration dates beyond userStorage fileExpirationTime', () => {
    const farFuture = new Date('2026-06-07T16:00:00.000Z')

    assert.strictEqual(isExpirationDateInPast(farFuture, now), false)
  })
})
