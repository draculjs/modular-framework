const TEST_USER = {
  id: 'user-1',
  name: 'Playwright User',
  username: 'playwright',
  email: 'playwright@example.com',
  phone: null,
  avatarurl: null,
  active: true,
  role: {
    id: 'role-1',
    name: 'admin',
    permissions: [
      'FILE_SHOW_OWN',
      'FILE_SHOW_ALL',
      'FILE_CREATE',
      'FILE_UPDATE',
      'FILE_DELETE',
      'FILE_DOWNLOAD',
      'USER_STORAGE_SHOW_ALL'
    ],
    __typename: 'Role'
  },
  groups: [],
  lastPasswordChange: new Date().toISOString(),
  __typename: 'User'
}

const theme = {
  primary: '#3F51B5',
  onPrimary: '#FFFFFF',
  secondary: '#1565C0',
  onSecondary: '#FFFFFF',
  background: '#F5F5F5',
  appBar: '#3F51B5',
  onAppBar: '#FFFFFF',
  __typename: 'Theme'
}

const logo = {
  mode: 'OnlyTitle',
  title: 'Playwright',
  filename: '',
  url: '',
  __typename: 'Logo'
}

function createToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    sub: TEST_USER.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  })).toString('base64url')

  return `${header}.${payload}.signature`
}

async function seedAuth(page) {
  await page.addInitScript(({ token, me, theme, logo }) => {
    const persistedState = JSON.stringify({
      user: {
        access_token: token,
        refresh_token: {
          id: 'refresh-token-id',
          expiryDate: String(Date.now() + 60 * 60 * 1000),
          sessionId: 'session-id'
        },
        me,
        avatarurl: null
      },
      customization: {
        lightTheme: theme,
        darkTheme: theme,
        logo,
        language: 'en',
        darkMode: false
      }
    })

    for (const storageKey of ['draculz', 'scaffold', 'vuex', 'undefined']) {
      window.localStorage.setItem(storageKey, persistedState)
    }
  }, { token: createToken(), me: TEST_USER, theme, logo })
}

function parseGraphqlPayload(request) {
  const body = request.postData() || ''
  const contentType = request.headers()['content-type'] || ''

  if (contentType.includes('multipart/form-data')) {
    const operationsMatch = body.match(/name="operations"[\s\S]*?\r\n\r\n([\s\S]*?)\r\n--/)
    if (operationsMatch) {
      return JSON.parse(operationsMatch[1])
    }
  }

  try {
    return JSON.parse(body)
  } catch (error) {
    return { query: body }
  }
}

function getOperationName(payload) {
  if (Array.isArray(payload)) {
    return payload[0] && getOperationName(payload[0])
  }

  if (payload.operationName) return payload.operationName

  const query = payload.query || ''
  const serializedPayload = JSON.stringify(payload)
  const match = query.match(/\b(query|mutation)\s+([A-Za-z0-9_]+)/)
  if (match) return match[2]

  if (serializedPayload.includes('customization') || serializedPayload.includes('lightTheme')) return 'customization'
  if (serializedPayload.includes('settingsFetch')) return 'settingsFetch'
  if (serializedPayload.includes('filePaginate')) return 'filePaginate'
  if (serializedPayload.includes('userStorageFindByUser')) return 'userStorageFindByUser'
  if (serializedPayload.includes('fileUpload')) return 'fileUpload'
  if (serializedPayload.includes('groups')) return 'groups'
  if (serializedPayload.includes('users')) return 'users'
  if (serializedPayload.includes('me')) return 'me'

  return null
}

async function fulfillJson(route, json) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(json)
  })
}

async function mockGraphql(page) {
  const requests = []
  const uploads = []

  await page.route('**/graphql/', async route => {
    const payload = parseGraphqlPayload(route.request())
    const operationName = getOperationName(payload)
    requests.push({ operationName, payload })
    if (process.env.PLAYWRIGHT_DEBUG_GRAPHQL) {
      // Helpful while maintaining the E2E mocks; disabled by default to keep test output clean.
      console.log('[graphql mock]', operationName, JSON.stringify(payload).slice(0, 500))
    }

    switch (operationName) {
      case 'customization':
        return fulfillJson(route, {
          data: {
            customization: {
              lightTheme: theme,
              darkTheme: theme,
              logo,
              language: 'en',
              __typename: 'Customization'
            }
          }
        })

      case 'settingsFetch':
        return fulfillJson(route, { data: { settingsFetch: [] } })

      case 'me':
        return fulfillJson(route, { data: { me: TEST_USER } })

      case 'filePaginate':
        return fulfillJson(route, {
          data: {
            filePaginate: {
              totalItems: 0,
              page: 1,
              items: []
            }
          }
        })

      case 'userStorageFindByUser':
        return fulfillJson(route, {
          data: {
            userStorageFindByUser: {
              id: 'storage-1',
              user: { id: TEST_USER.id, name: TEST_USER.name, username: TEST_USER.username },
              capacity: 100,
              usedSpace: 0,
              maxFileSize: 10,
              fileExpirationTime: 1,
              deleteByLastAccess: false,
              deleteByCreatedAt: false,
              filesPrivacy: 'private'
            }
          }
        })

      case 'groups':
        return fulfillJson(route, { data: { groups: [] } })

      case 'users':
        return fulfillJson(route, { data: { users: [] } })

      case 'fileUpload': {
        uploads.push(payload.variables)
        return fulfillJson(route, {
          data: {
            fileUpload: {
              id: 'file-1',
              filename: 'playwright-expiration.txt',
              description: payload.variables.description || '',
              tags: payload.variables.tags || [],
              mimetype: 'text/plain',
              type: 'text',
              extension: '.txt',
              relativePath: 'media/files/playwright/playwright-expiration.txt',
              absolutePath: '/tmp/playwright-expiration.txt',
              size: '0.01',
              url: 'http://media.test/media/files/playwright/playwright-expiration.txt',
              createdAt: new Date().toISOString(),
              createdBy: { user: TEST_USER.id, username: TEST_USER.username },
              lastAccess: new Date().toISOString(),
              expirationDate: payload.variables.expirationDate,
              isPublic: payload.variables.isPublic || false,
              hits: 0,
              groups: [],
              users: []
            }
          }
        })
      }

      default:
        return fulfillJson(route, { data: {} })
    }
  })

  return { requests, uploads }
}

module.exports = {
  mockGraphql,
  seedAuth
}
