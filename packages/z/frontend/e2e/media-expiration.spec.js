const { test, expect } = require('@playwright/test')
const { mockGraphql, seedAuth } = require('./support/graphqlMock')

async function openCreateDialog(page) {
  await page.goto('/file-management')
  await expect(page.locator('main').getByText('File management')).toBeVisible()

  await page.getByTestId('crud-add-button').click()
  await expect(page.getByText('Creating File')).toBeVisible()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'playwright-expiration.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Playwright expiration test')
  })
}

async function setFileFormExpiration(page, expirationDate) {
  await page.waitForFunction(() => {
    const findMountedVueComponent = name => {
      const visited = new Set()

      const findByName = vm => {
        if (!vm || visited.has(vm)) return null
        visited.add(vm)
        if (vm.$options && vm.$options.name === name) return vm
        for (const child of vm.$children || []) {
          const found = findByName(child)
          if (found) return found
        }
        return null
      }

      for (const element of document.querySelectorAll('*')) {
        const found = findByName(element.__vue__)
        if (found) return found
      }

      return null
    }

    return !!findMountedVueComponent('FileForm')
  })

  await page.evaluate(value => {
    const findMountedVueComponent = name => {
      const visited = new Set()

      const findByName = vm => {
        if (!vm || visited.has(vm)) return null
        visited.add(vm)
        if (vm.$options && vm.$options.name === name) return vm
        for (const child of vm.$children || []) {
          const found = findByName(child)
          if (found) return found
        }
        return null
      }

      for (const element of document.querySelectorAll('*')) {
        const found = findByName(element.__vue__)
        if (found) return found
      }

      return null
    }

    const form = findMountedVueComponent('FileForm')
    form.$set(form.form, 'expirationDate', value)
  }, expirationDate)
}

test.describe('media explicit expiration create flow', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page)
  })

  test('submits fileUpload for future explicit expiration beyond userStorage fileExpirationTime', async ({ page }) => {
    const graphql = await mockGraphql(page)
    const farFutureExpiration = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()

    await openCreateDialog(page)
    await setFileFormExpiration(page, farFutureExpiration)
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect.poll(() => graphql.uploads.length).toBe(1)
    expect(graphql.uploads[0].expirationDate).toBe(farFutureExpiration)
    await expect(page.getByText(/File expiration time cannot be longer than/i)).toHaveCount(0)
  })

  test('blocks fileUpload for past explicit expiration', async ({ page }) => {
    const graphql = await mockGraphql(page)
    const pastExpiration = new Date(Date.now() - 60 * 1000).toISOString()

    await openCreateDialog(page)
    await setFileFormExpiration(page, pastExpiration)
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Expiration date must be older than current date')).toBeVisible()
    expect(graphql.uploads).toHaveLength(0)
  })
})
