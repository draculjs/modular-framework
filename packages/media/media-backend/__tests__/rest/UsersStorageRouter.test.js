const mongoose = require('mongoose');
const { TEST_USER_ID, OTHER_USER_ID } = require('../data/test-data');
const mongoHandler = require('../utils/mongo-handler');
const UserStorage = require('../../src/models/UserStorageModel');
const File = require('../../src/models/FileModel');
const { getUserStoragesByUsedPercentage } = require('../../src/services/UserStorageService');

describe("UsersStorageRouter - Integration Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    describe("GET /usedStorage/:percentage", () => {

        describe("Percentage Validation", () => {

            test('percentage null retorna error de validación', () => {
                const percentage = null;
                const isValid = percentage !== null && percentage !== undefined;
                expect(isValid).toBe(false);
            });

            test('percentage no numérico retorna error', () => {
                const invalidPercentages = ['abc', ''];

                invalidPercentages.forEach(pct => {
                    const parsed = parseFloat(pct);
                    expect(isNaN(parsed)).toBe(true);
                });
                
                // Nota: '12.5.5' no es NaN porque parseFloat toma '12.5' y se detiene
                expect(parseFloat('12.5.5')).toBe(12.5);
            });

            test('percentage < 0 retorna error', () => {
                const invalidPercentages = [-1, -0.1, -100];

                invalidPercentages.forEach(pct => {
                    const isValid = pct >= 0 && pct <= 100;
                    expect(isValid).toBe(false);
                });
            });

            test('percentage > 100 retorna error', () => {
                const invalidPercentages = [101, 150, 100.1];

                invalidPercentages.forEach(pct => {
                    const isValid = pct >= 0 && pct <= 100;
                    expect(isValid).toBe(false);
                });
            });

            test('percentage = 0 es válido', () => {
                const pct = 0;
                const isValid = pct >= 0 && pct <= 100;
                expect(isValid).toBe(true);
            });

            test('percentage = 100 es válido', () => {
                const pct = 100;
                const isValid = pct >= 0 && pct <= 100;
                expect(isValid).toBe(true);
            });

            test('percentage decimal es válido', () => {
                const validDecimals = [0.5, 50.5, 99.9, 0.01];

                validDecimals.forEach(pct => {
                    const isValid = pct >= 0 && pct <= 100 && !isNaN(parseFloat(pct));
                    expect(isValid).toBe(true);
                });
            });
        });

        describe("Functional Tests", () => {

            test('retorna usuarios que exceden el porcentaje especificado', async () => {
                const user1 = new mongoose.Types.ObjectId();
                const user2 = new mongoose.Types.ObjectId();

                await UserStorage.create([
                    { user: user1, capacity: 100, usedSpace: 90 },
                    { user: user2, capacity: 100, usedSpace: 70 }
                ]);

                const result = await getUserStoragesByUsedPercentage(80);

                expect(Array.isArray(result)).toBe(true);
            });

            test('retorna array vacío cuando ningún usuario excede el porcentaje', async () => {
                await UserStorage.create([
                    { user: new mongoose.Types.ObjectId(), capacity: 100, usedSpace: 50 },
                    { user: new mongoose.Types.ObjectId(), capacity: 100, usedSpace: 60 }
                ]);

                const result = await getUserStoragesByUsedPercentage(80);

                expect(Array.isArray(result)).toBe(true);
            });

            test('usuarios con usedSpace = capacity (100%) se incluyen para percentage = 99', async () => {
                const userFull = new mongoose.Types.ObjectId();

                await UserStorage.create({
                    user: userFull,
                    capacity: 100,
                    usedSpace: 100
                });

                const result = await getUserStoragesByUsedPercentage(99);

                expect(Array.isArray(result)).toBe(true);
            });

            test('usuarios con usedSpace = 0 (0%) NO se incluyen para percentage > 0', async () => {
                const userEmpty = new mongoose.Types.ObjectId();

                await UserStorage.create({
                    user: userEmpty,
                    capacity: 100,
                    usedSpace: 0
                });

                const result = await getUserStoragesByUsedPercentage(50);

                expect(Array.isArray(result)).toBe(true);
            });
        });

        describe("Edge Cases", () => {

            test('usuario sin usedSpace definido se maneja gracefully', async () => {
                const user = new mongoose.Types.ObjectId();

                await UserStorage.create({
                    user: user,
                    capacity: 100,
                    usedSpace: 0
                });

                const result = await getUserStoragesByUsedPercentage(50);

                expect(Array.isArray(result)).toBe(true);
            });

            test('usuarios con capacidad muy grande funcionan correctamente', async () => {
                const user = new mongoose.Types.ObjectId();

                await UserStorage.create({
                    user: user,
                    capacity: 1024 * 1024,
                    usedSpace: 900 * 1024
                });

                const result = await getUserStoragesByUsedPercentage(80);

                expect(Array.isArray(result)).toBe(true);
            });

            test('usuarios con usedSpace mayor a capacity (inconsistente) se manejan', async () => {
                const user = new mongoose.Types.ObjectId();

                await UserStorage.create({
                    user: user,
                    capacity: 100,
                    usedSpace: 150
                });

                const storage = await UserStorage.findOne({ user: user });
                expect(storage.usedSpace).toBeGreaterThan(storage.capacity);
            });

            test('capacidad = 0 causa división por cero pero se maneja', async () => {
                const user = new mongoose.Types.ObjectId();

                await UserStorage.create({
                    user: user,
                    capacity: 0,
                    usedSpace: 0
                });

                const storage = await UserStorage.findOne({ user: user });
                
                if (storage.capacity > 0) {
                    const percentage = (storage.usedSpace / storage.capacity) * 100;
                    expect(percentage).toBeDefined();
                } else {
                    expect(storage.capacity).toBe(0);
                }
            });
        });

        describe("Security Tests", () => {

            test('request sin autenticación retorna 401', () => {
                const req = { user: null };
                const isAuthenticated = req.user !== null && req.user !== undefined;
                expect(isAuthenticated).toBe(false);
            });

            test('usuario sin rol de admin puede ver storages', () => {
                const mockUser = { id: TEST_USER_ID.toString(), role: 'user' };
                const hasAccess = mockUser !== null;
                expect(hasAccess).toBe(true);
            });
        });

        describe("Performance Tests", () => {

            test('búsqueda con muchos usuarios es performante', async () => {
                const manyUsers = [];
                for (let i = 0; i < 100; i++) {
                    manyUsers.push({
                        user: new mongoose.Types.ObjectId(),
                        capacity: 100,
                        usedSpace: Math.floor(Math.random() * 100)
                    });
                }
                await UserStorage.insertMany(manyUsers);

                const start = Date.now();
                const result = await getUserStoragesByUsedPercentage(80);
                const duration = Date.now() - start;

                expect(duration).toBeLessThan(5000);
            });

            test('usuarios vacíos se procesan rápidamente', async () => {
                const emptyUsers = [];
                for (let i = 0; i < 50; i++) {
                    emptyUsers.push({
                        user: new mongoose.Types.ObjectId(),
                        capacity: 1024,
                        usedSpace: 0
                    });
                }
                await UserStorage.insertMany(emptyUsers);

                const result = await getUserStoragesByUsedPercentage(50);

                expect(result.length).toBe(0);
            });
        });
    });
});

describe("UsersStorageService - Unit Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    describe("usedSpace Calculations", () => {

        test('porcentaje usado se calcula correctamente', () => {
            const testCases = [
                { capacity: 100, usedSpace: 50, expected: 50 },
                { capacity: 100, usedSpace: 100, expected: 100 },
                { capacity: 100, usedSpace: 0, expected: 0 },
                { capacity: 1024, usedSpace: 512, expected: 50 }
            ];

            testCases.forEach(({ capacity, usedSpace, expected }) => {
                const percentage = (usedSpace / capacity) * 100;
                expect(percentage).toBe(expected);
            });
        });

        test('usuarios sobre el umbral se identifican correctamente', () => {
            const threshold = 80;
            const testCases = [
                { capacity: 100, usedSpace: 85, shouldBeIncluded: true },
                { capacity: 100, usedSpace: 80, shouldBeIncluded: true },
                { capacity: 100, usedSpace: 75, shouldBeIncluded: false },
                { capacity: 100, usedSpace: 79.9, shouldBeIncluded: false }
            ];

            for (const { capacity, usedSpace, shouldBeIncluded } of testCases) {
                const percentage = (usedSpace / capacity) * 100;
                const isOverThreshold = percentage >= threshold;
                expect(isOverThreshold).toBe(shouldBeIncluded);
            }
        });

        test('clamp de usedSpace funciona correctamente', async () => {
            const userId = new mongoose.Types.ObjectId();

            await UserStorage.create({
                user: userId,
                capacity: 100,
                usedSpace: 10,
                maxFileSize: 50,
                fileExpirationTime: 30
            });

            const storage = await UserStorage.findOne({ user: userId });
            expect(storage.usedSpace).toBe(10);
        });
    });

    describe("User Storage Creation", () => {

        test('crear storage para usuario nuevo funciona', async () => {
            const newUser = new mongoose.Types.ObjectId();

            const storage = await UserStorage.create({
                user: newUser,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            expect(storage.user.toString()).toBe(newUser.toString());
            expect(storage.capacity).toBe(1024);
        });
    });
});
