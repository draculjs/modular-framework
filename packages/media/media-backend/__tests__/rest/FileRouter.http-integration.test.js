const mongoose = require('mongoose');
const request = require('supertest');
const { FILE_SHOW_ALL, FILE_SHOW_OWN, FILE_UPDATE_ALL, FILE_UPDATE_OWN, FILE_DELETE_ALL, FILE_DELETE_OWN, FILE_SHOW_PUBLIC } = require('../../src/permissions/File');
const { TEST_USER_ID, OTHER_USER_ID, createTestFile, daysFromNow } = require('../data/test-data');
const mongoHandler = require('../utils/mongo-handler');
const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const { createTestAppWithDirectRouter, createMockRbac, setRbacPermissions, setFetchMyGroupsMock, resetFetchMyGroups } = require('../utils/test-app');

describe("FileRouter HTTP Integration Tests - COMPLETE COVERAGE", () => {

    let app;
    let mockRbac;

    beforeAll(async () => {
        await mongoHandler.connect();
        app = createTestAppWithDirectRouter(createMockRbac({}));
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        jest.clearAllMocks();
        resetFetchMyGroups();
        mockRbac = createMockRbac({});
        
        await UserStorage.create({
            user: TEST_USER_ID,
            capacity: 1024,
            usedSpace: 0,
            maxFileSize: 100,
            fileExpirationTime: 30,
            deleteByLastAccess: true,
            deleteByCreatedAt: false,
            filesPrivacy: 'private'
        });

        await UserStorage.create({
            user: OTHER_USER_ID,
            capacity: 1024,
            usedSpace: 0,
            maxFileSize: 100,
            fileExpirationTime: 30,
            deleteByLastAccess: true,
            deleteByCreatedAt: false,
            filesPrivacy: 'private'
        });
    });

    // =========================================================================
    // GET /file/:id - Obtener archivo por ID
    // =========================================================================
    describe("GET /api/file/:id - Get File by ID", () => {

        describe("Authentication & Authorization", () => {
            test('GET sin autenticacion retorna 401', async () => {
                const file = await File.create(createTestFile({
                    filename: 'test.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                const response = await request(app)
                    .get(`/api/file/${file._id}`);

                expect(response.status).toBe(401);
            });
        });

        describe("File Access Permissions", () => {
            test('archivo propio visible con FILE_SHOW_OWN', async () => {
                const file = await File.create(createTestFile({
                    filename: 'own-file.json',
                    isPublic: false,
                    createdBy: { user: TEST_USER_ID, username: 'testuser' }
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_OWN]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);
                expect(response.body.filename).toBe('own-file.json');
            });

            test('archivo de OTRO no visible con FILE_SHOW_OWN', async () => {
                const file = await File.create(createTestFile({
                    filename: 'other-file.json',
                    isPublic: false,
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    groups: [],
                    users: []
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_OWN]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(404);
            });

            test('archivo público visible con FILE_SHOW_PUBLIC', async () => {
                const file = await File.create(createTestFile({
                    filename: 'public-file.json',
                    isPublic: true,
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_PUBLIC]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);
                expect(response.body.isPublic).toBe(true);
            });

            test('archivo privado NO visible para otros usuarios con FILE_SHOW_PUBLIC', async () => {
                const file = await File.create(createTestFile({
                    filename: 'private-file.json',
                    isPublic: false,
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    groups: [],
                    users: []
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_PUBLIC]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(404);
            });

            test('admin (FILE_SHOW_ALL) ve cualquier archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'admin-only.json',
                    isPublic: false,
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    groups: [],
                    users: []
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_ALL]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);
                expect(response.body.filename).toBe('admin-only.json');
            });

            test('archivo compartido via users[] es accesible', async () => {
                const file = await File.create(createTestFile({
                    filename: 'shared-file.json',
                    isPublic: false,
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    users: [TEST_USER_ID]
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_OWN]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);
                expect(response.body.filename).toBe('shared-file.json');
            });

            test('archivo de grupo es accesible para miembros', async () => {
                const groupId = new mongoose.Types.ObjectId();
                const file = await File.create(createTestFile({
                    filename: 'group-file.json',
                    isPublic: false,
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    groups: [groupId]
                }));

                setRbacPermissions(mockRbac, { [FILE_SHOW_OWN]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                setFetchMyGroupsMock([groupId.toString()]);

                const response = await request(app)
                    .get(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);
                expect(response.body.filename).toBe('group-file.json');
            });
        });

        describe("Not Found & Validation", () => {
            test('archivo inexistente retorna 404', async () => {
                const nonExistentId = new mongoose.Types.ObjectId();

                setRbacPermissions(mockRbac, { [FILE_SHOW_ALL]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get(`/api/file/${nonExistentId}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(404);
            });

            test('ID invalido retorna 400', async () => {
                setRbacPermissions(mockRbac, { [FILE_SHOW_ALL]: true });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .get('/api/file/invalid-id')
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(400);
            });
        });
    });

    // =========================================================================
    // PATCH /file/:id - Actualizar metadata
    // =========================================================================
    describe("PATCH /api/file/:id - Update File Metadata", () => {

        describe("CRITICAL BUG FIX: FILE_UPDATE_OWN allows editing own files", () => {
            test('BUG FIX: usuario con FILE_UPDATE_OWN (sin FILE_SHOW_OWN) puede editar SU archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'my-file-to-update.json',
                    description: 'original description',
                    createdBy: { user: TEST_USER_ID, username: 'testuser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: false,
                    [FILE_SHOW_OWN]: false,
                    [FILE_UPDATE_ALL]: false,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'updated via FILE_UPDATE_OWN' });

                expect(response.status).toBe(200);
                expect(response.body.description).toBe('updated via FILE_UPDATE_OWN');

                const fromDb = await File.findById(file._id);
                expect(fromDb.description).toBe('updated via FILE_UPDATE_OWN');
            });

            test('BUG FIX: usuario con FILE_UPDATE_OWN NO puede editar archivo de OTRO', async () => {
                const file = await File.create(createTestFile({
                    filename: 'other-file.json',
                    description: 'original description',
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: false,
                    [FILE_SHOW_OWN]: false,
                    [FILE_UPDATE_ALL]: false,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'hacked by FILE_UPDATE_OWN' });

                expect(response.status).toBe(500);

                const fromDb = await File.findById(file._id);
                expect(fromDb.description).toBe('original description');
            });

            test('usuario con FILE_SHOW_ALL puede editar cualquier archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'any-file.json',
                    description: 'original',
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'admin updated' });

                expect(response.status).toBe(200);
                expect(response.body.description).toBe('admin updated');
            });

            test('usuario con FILE_UPDATE_OWN + FILE_SHOW_OWN puede editar SU archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'own-file.json',
                    description: 'original',
                    createdBy: { user: TEST_USER_ID, username: 'testuser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_OWN]: true,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'updated with both perms' });

                expect(response.status).toBe(200);
                expect(response.body.description).toBe('updated with both perms');
            });
        });

        describe("Authentication & Authorization", () => {
            test('PATCH sin usuario retorna 401', async () => {
                const file = await File.create(createTestFile({
                    filename: 'test.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .send({ description: 'update' });

                expect(response.status).toBe(401);
            });

            test('PATCH sin permisos requeridos retorna 403', async () => {
                const file = await File.create(createTestFile({
                    filename: 'test.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: false,
                    [FILE_SHOW_OWN]: false
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'update' });

                expect(response.status).toBe(403);
            });
        });

        describe("Field Updates - Real Persistence", () => {
            test('PATCH actualiza description y persiste en BD', async () => {
                const file = await File.create(createTestFile({
                    filename: 'desc-test.json',
                    description: 'old',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'new description' });

                expect(response.status).toBe(200);
                expect(response.body.description).toBe('new description');

                const fromDb = await File.findById(file._id);
                expect(fromDb.description).toBe('new description');
            });

            test('PATCH actualiza isPublic', async () => {
                const file = await File.create(createTestFile({
                    filename: 'public-test.json',
                    isPublic: false,
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ isPublic: true });

                expect(response.status).toBe(200);
                expect(response.body.isPublic).toBe(true);

                const fromDb = await File.findById(file._id);
                expect(fromDb.isPublic).toBe(true);
            });

            test('PATCH actualiza tags', async () => {
                const file = await File.create(createTestFile({
                    filename: 'tags-test.json',
                    tags: ['old'],
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ tags: ['new', 'tags'] });

                expect(response.status).toBe(200);
                expect(response.body.tags).toEqual(['new', 'tags']);

                const fromDb = await File.findById(file._id);
                expect(fromDb.tags.toObject()).toEqual(['new', 'tags']);
            });

            test('PATCH sin campos retorna error', async () => {
                const file = await File.create(createTestFile({
                    filename: 'empty-patch.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({});

                expect(response.status).toBe(500);
            });
        });

        describe("Not Found & Validation", () => {
            test('PATCH archivo inexistente retorna 500', async () => {
                const nonExistentId = new mongoose.Types.ObjectId();

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .patch(`/api/file/${nonExistentId}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .send({ description: 'update' });

                expect(response.status).toBe(500);
            });
        });
    });

    // =========================================================================
    // PUT /file/:id - Reemplazar archivo (EL BUG PRINCIPAL)
    // =========================================================================
    describe("PUT /api/file/:id - Replace File (CRITICAL BUG ENDPOINT)", () => {

        describe("CRITICAL BUG FIX: FILE_UPDATE_OWN allows replacing own files", () => {
            test('BUG FIX: usuario con FILE_UPDATE_OWN (sin FILE_SHOW_OWN) puede reemplazar SU archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'original-file.json',
                    description: 'original',
                    extension: '.json',
                    mimetype: 'application/json',
                    createdBy: { user: TEST_USER_ID, username: 'testuser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: false,
                    [FILE_SHOW_OWN]: false,
                    [FILE_UPDATE_ALL]: false,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .attach('file', Buffer.from('new content'), {
                        filename: 'new-file.json',
                        contentType: 'application/json'
                    });

                expect(response.status).toBe(200);
            });

            test('BUG FIX: usuario con FILE_UPDATE_OWN NO puede reemplazar archivo de OTRO', async () => {
                const file = await File.create(createTestFile({
                    filename: 'other-file.json',
                    description: 'original',
                    extension: '.json',
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: false,
                    [FILE_SHOW_OWN]: false,
                    [FILE_UPDATE_ALL]: false,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .attach('file', Buffer.from('trying to replace'), {
                        filename: 'other.json',
                        contentType: 'application/json'
                    });

                expect(response.status).toBe(400);
            });

            test('usuario con FILE_UPDATE_ALL puede reemplazar cualquier archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'any-file.json',
                    extension: '.json',
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .attach('file', Buffer.from('admin content'), {
                        filename: 'admin.json',
                        contentType: 'application/json'
                    });

                expect(response.status).toBe(200);
            });

            test('usuario con FILE_UPDATE_OWN + FILE_SHOW_OWN puede reemplazar SU archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'own-file.json',
                    extension: '.json',
                    createdBy: { user: TEST_USER_ID, username: 'testuser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_OWN]: true,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .attach('file', Buffer.from('updated content'), {
                        filename: 'updated.json',
                        contentType: 'application/json'
                    });

                expect(response.status).toBe(200);
            });
        });

        describe("Authentication & Authorization", () => {
            test('PUT sin usuario retorna 401', async () => {
                const file = await File.create(createTestFile({
                    filename: 'test.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .attach('file', Buffer.from('content'), {
                        filename: 'test.json',
                        contentType: 'application/json'
                    });

                expect(response.status).toBe(401);
            });

            test('PUT sin permisos requeridos retorna 403', async () => {
                const file = await File.create(createTestFile({
                    filename: 'test.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: false,
                    [FILE_SHOW_OWN]: false
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .attach('file', Buffer.from('content'), {
                        filename: 'test.json',
                        contentType: 'application/json'
                    });

                expect(response.status).toBe(403);
            });

            test('PUT sin archivo retorna 400', async () => {
                const file = await File.create(createTestFile({
                    filename: 'test.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_UPDATE_ALL]: true,
                    [FILE_UPDATE_OWN]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(400);
            });
        });

        describe("File Extension Validation", () => {
            test('PUT con extensión diferente retorna 400 (extensión debe coincidir)', async () => {
                const file = await File.create(createTestFile({
                    filename: 'original.json',
                    extension: '.json',
                    mimetype: 'application/json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_ALL]: true,
                    [FILE_UPDATE_ALL]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .put(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString())
                    .attach('file', Buffer.from('content'), {
                        filename: 'different.txt',
                        contentType: 'text/plain'
                    });

                expect(response.status).toBe(400);
            });
        });
    });

    // =========================================================================
    // DELETE /file/:id - Eliminar archivo
    // =========================================================================
    describe("DELETE /api/file/:id - Delete File", () => {

        describe("Authentication & Authorization", () => {
            test('DELETE sin autenticacion retorna 401', async () => {
                const file = await File.create(createTestFile({
                    filename: 'no-auth.json',
                    createdBy: { user: TEST_USER_ID, username: 'test' }
                }));

                const response = await request(app)
                    .delete(`/api/file/${file._id}`);

                expect(response.status).toBe(401);
            });

            test('DELETE sin permisos retorna 403', async () => {
                const file = await File.create(createTestFile({
                    filename: 'no-perms.json',
                    createdBy: { user: OTHER_USER_ID, username: 'other' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_SHOW_PUBLIC]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .delete(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(403);
            });
        });

        describe("File Deletion Permissions", () => {
            test('DELETE con FILE_DELETE_ALL elimina cualquier archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'delete-me.json',
                    relativePath: '/tmp/test/delete-me.json',
                    absolutePath: '/tmp/test/delete-me.json',
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_DELETE_ALL]: true,
                    [FILE_SHOW_PUBLIC]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .delete(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('The file was deleted');

                const fromDb = await File.findById(file._id);
                expect(fromDb).toBeNull();
            });

            test('DELETE con FILE_DELETE_OWN elimina SU archivo', async () => {
                const file = await File.create(createTestFile({
                    filename: 'delete-own.json',
                    relativePath: '/tmp/test/delete-own.json',
                    absolutePath: '/tmp/test/delete-own.json',
                    createdBy: { user: TEST_USER_ID, username: 'testuser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_DELETE_OWN]: true,
                    [FILE_SHOW_PUBLIC]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .delete(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(200);

                const fromDb = await File.findById(file._id);
                expect(fromDb).toBeNull();
            });

            test('DELETE con FILE_DELETE_OWN NO puede eliminar archivo de OTRO', async () => {
                const file = await File.create(createTestFile({
                    filename: 'dont-delete.json',
                    relativePath: '/tmp/test/dont-delete.json',
                    absolutePath: '/tmp/test/dont-delete.json',
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
                }));

                setRbacPermissions(mockRbac, {
                    [FILE_DELETE_OWN]: true,
                    [FILE_SHOW_PUBLIC]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .delete(`/api/file/${file._id}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(404);

                const fromDb = await File.findById(file._id);
                expect(fromDb).not.toBeNull();
            });
        });

        describe("Not Found & Validation", () => {
            test('DELETE archivo inexistente retorna 404', async () => {
                const nonExistentId = new mongoose.Types.ObjectId();

                setRbacPermissions(mockRbac, {
                    [FILE_DELETE_ALL]: true,
                    [FILE_SHOW_PUBLIC]: true
                });
                app = createTestAppWithDirectRouter(mockRbac);

                const response = await request(app)
                    .delete(`/api/file/${nonExistentId}`)
                    .set('x-user-id', TEST_USER_ID.toString());

                expect(response.status).toBe(404);
            });
        });
    });

    // =========================================================================
    // End-to-End Permission Flow Tests
    // =========================================================================
    describe("End-to-End Permission Flow", () => {

        test('usuario con SOLO FILE_UPDATE_OWN (no FILE_SHOW_OWN) puede actualizar archivo propio (PATCH funciona)', async () => {
            const file = await File.create(createTestFile({
                filename: 'e2e-test.json',
                description: 'e2e-original',
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_UPDATE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const getResponse = await request(app)
                .get(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString());
            expect(getResponse.status).toBe(403);

            const patchResponse = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'e2e-updated' });
            expect(patchResponse.status).toBe(200);
            expect(patchResponse.body.description).toBe('e2e-updated');

            const fromDb = await File.findById(file._id);
            expect(fromDb.description).toBe('e2e-updated');
        });

        test('multiple updates to same file via FILE_UPDATE_OWN', async () => {
            const file = await File.create(createTestFile({
                filename: 'multi-update.json',
                description: 'v1',
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_UPDATE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const patch1 = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'v2' });
            expect(patch1.status).toBe(200);

            const patch2 = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'v3' });
            expect(patch2.status).toBe(200);

            const fromDb = await File.findById(file._id);
            expect(fromDb.description).toBe('v3');
        });

        test('archivo privado con FILE_SHOW_OWN + FILE_UPDATE_OWN permite ver y editar', async () => {
            const file = await File.create(createTestFile({
                filename: 'private-own.json',
                description: 'private content',
                isPublic: false,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_OWN]: true,
                [FILE_UPDATE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const getResponse = await request(app)
                .get(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString());
            expect(getResponse.status).toBe(200);

            const patchResponse = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'updated private' });
            expect(patchResponse.status).toBe(200);
        });

        test('archivo público solo con FILE_SHOW_PUBLIC permite ver pero NO editar', async () => {
            const file = await File.create(createTestFile({
                filename: 'public-edit-test.json',
                description: 'public content',
                isPublic: true,
                createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_PUBLIC]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const getResponse = await request(app)
                .get(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString());
            expect(getResponse.status).toBe(200);

            const patchResponse = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'try update' });
            expect(patchResponse.status).toBe(403);
        });

        test('admin con FILE_SHOW_ALL + FILE_UPDATE_ALL + FILE_DELETE_ALL tiene control total', async () => {
            const ownFile = await File.create(createTestFile({
                filename: 'admin-own.json',
                description: 'own',
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));
            const otherFile = await File.create(createTestFile({
                filename: 'admin-other.json',
                description: 'other',
                relativePath: '/tmp/test/admin-other.json',
                absolutePath: '/tmp/test/admin-other.json',
                createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_ALL]: true,
                [FILE_UPDATE_ALL]: true,
                [FILE_DELETE_ALL]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const getOwn = await request(app)
                .get(`/api/file/${ownFile._id}`)
                .set('x-user-id', TEST_USER_ID.toString());
            expect(getOwn.status).toBe(200);

            const getOther = await request(app)
                .get(`/api/file/${otherFile._id}`)
                .set('x-user-id', TEST_USER_ID.toString());
            expect(getOther.status).toBe(200);

            const patchResponse = await request(app)
                .patch(`/api/file/${otherFile._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'admin updated' });
            expect(patchResponse.status).toBe(200);

            const deleteResponse = await request(app)
                .delete(`/api/file/${otherFile._id}`)
                .set('x-user-id', TEST_USER_ID.toString());
            expect(deleteResponse.status).toBe(200);

            const fromDb = await File.findById(otherFile._id);
            expect(fromDb).toBeNull();
        });
    });

    // =========================================================================
    // Real Database Persistence Tests
    // =========================================================================
    describe("Real Database Persistence", () => {

        test('PATCH persiste todos los campos en BD', async () => {
            const file = await File.create(createTestFile({
                filename: 'persist.json',
                description: 'old',
                tags: ['old'],
                isPublic: false,
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_ALL]: true,
                [FILE_UPDATE_ALL]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'new desc', tags: ['new', 'tags'], isPublic: true });

            const fromDb = await File.findById(file._id);
            expect(fromDb.description).toBe('new desc');
            expect(fromDb.tags.toObject()).toEqual(['new', 'tags']);
            expect(fromDb.isPublic).toBe(true);
        });

        test('campos no enviados NO se modifican', async () => {
            const file = await File.create(createTestFile({
                filename: 'partial.json',
                description: 'keep-this',
                tags: ['keep-these'],
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_ALL]: true,
                [FILE_UPDATE_ALL]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'only this' });

            const fromDb = await File.findById(file._id);
            expect(fromDb.description).toBe('only this');
            expect(fromDb.tags.toObject()).toEqual(['keep-these']);
        });

        test('DELETE elimina permanentemente de BD', async () => {
            const file = await File.create(createTestFile({
                filename: 'permanent.json',
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_DELETE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const countBefore = await File.countDocuments({ _id: file._id });
            expect(countBefore).toBe(1);

            await request(app)
                .delete(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString());

            const countAfter = await File.countDocuments({ _id: file._id });
            expect(countAfter).toBe(0);
        });

        test('operación parcial no afecta archivos no relacionados', async () => {
            const file1 = await File.create(createTestFile({
                filename: 'file1.json',
                description: 'keep',
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));
            const file2 = await File.create(createTestFile({
                filename: 'file2.json',
                description: 'also keep',
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_ALL]: true,
                [FILE_UPDATE_ALL]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            await request(app)
                .patch(`/api/file/${file1._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'updated' });

            const fromDb1 = await File.findById(file1._id);
            const fromDb2 = await File.findById(file2._id);

            expect(fromDb1.description).toBe('updated');
            expect(fromDb2.description).toBe('also keep');
        });
    });

    // =========================================================================
    // Permission Escalation Prevention Tests
    // =========================================================================
    describe("Permission Escalation Prevention", () => {

        test('usuario NO puede ver archivos de otros aunque tenga UPDATE', async () => {
            const file = await File.create(createTestFile({
                filename: 'escalate-test.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                groups: [],
                users: []
            }));

            setRbacPermissions(mockRbac, {
                [FILE_UPDATE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const response = await request(app)
                .get(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString());

            expect(response.status).toBe(403);
        });

        test('usuario NO puede ver archivos aunque tenga DELETE', async () => {
            const file = await File.create(createTestFile({
                filename: 'delete-see-test.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                groups: [],
                users: []
            }));

            setRbacPermissions(mockRbac, {
                [FILE_DELETE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const response = await request(app)
                .get(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString());

            expect(response.status).toBe(403);
        });

        test('archivo compartido via users[] es editable si tiene FILE_UPDATE_OWN', async () => {
            const file = await File.create(createTestFile({
                filename: 'shared-editable.json',
                description: 'shared content',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                users: [TEST_USER_ID]
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_OWN]: true,
                [FILE_UPDATE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            const patchResponse = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'updated shared' });

            expect(patchResponse.status).toBe(200);
            expect(patchResponse.body.description).toBe('updated shared');
        });

        test('archivo de grupo es editable si tiene FILE_UPDATE_OWN', async () => {
            const groupId = new mongoose.Types.ObjectId();
            const file = await File.create(createTestFile({
                filename: 'group-editable.json',
                description: 'group content',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                groups: [groupId]
            }));

            setRbacPermissions(mockRbac, {
                [FILE_SHOW_OWN]: true,
                [FILE_UPDATE_OWN]: true
            });
            app = createTestAppWithDirectRouter(mockRbac);

            setFetchMyGroupsMock([groupId.toString()]);

            const patchResponse = await request(app)
                .patch(`/api/file/${file._id}`)
                .set('x-user-id', TEST_USER_ID.toString())
                .send({ description: 'updated group' });

            expect(patchResponse.status).toBe(200);
            expect(patchResponse.body.description).toBe('updated group');
        });
    });
});
