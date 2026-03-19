const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const TEST_USER_ID = new ObjectId();
const OTHER_USER_ID = new ObjectId();

const TEST_USER = {
    _id: TEST_USER_ID,
    username: 'testuser',
    email: 'test@test.com',
    name: 'Test User'
};

const OTHER_USER = {
    _id: OTHER_USER_ID,
    username: 'otheruser',
    email: 'other@test.com',
    name: 'Other User'
};

const USER_STORAGE_BY_LAST_ACCESS = {
    user: TEST_USER_ID,
    capacity: 1024,
    usedSpace: 0,
    maxFileSize: 100,
    fileExpirationTime: 30,
    deleteByLastAccess: true,
    deleteByCreatedAt: false,
    filesPrivacy: 'private'
};

const USER_STORAGE_BY_CREATED_AT = {
    user: TEST_USER_ID,
    capacity: 1024,
    usedSpace: 0,
    maxFileSize: 100,
    fileExpirationTime: 30,
    deleteByLastAccess: false,
    deleteByCreatedAt: true,
    filesPrivacy: 'private'
};

const createTestFile = (overrides = {}) => {
    const now = new Date();
    return {
        filename: 'test-file.json',
        description: 'Test file',
        tags: [],
        mimetype: 'application/json',
        encoding: '7bit',
        type: 'application',
        extension: '.json',
        relativePath: '/tmp/test/test-file.json',
        absolutePath: '/tmp/test/test-file.json',
        size: 1024,
        url: 'http://localhost/test-file.json',
        lastAccess: now,
        createdAt: now,
        createdBy: { user: TEST_USER_ID, username: TEST_USER.username },
        expirationDate: null,
        isPublic: false,
        hits: 0,
        groups: [],
        users: [],
        fileReplaces: [],
        ...overrides
    };
};

const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const daysFromNow = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

const hoursFromNow = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};

module.exports = {
    ObjectId,
    TEST_USER,
    TEST_USER_ID,
    OTHER_USER,
    OTHER_USER_ID,
    USER_STORAGE_BY_LAST_ACCESS,
    USER_STORAGE_BY_CREATED_AT,
    createTestFile,
    daysAgo,
    daysFromNow,
    hoursFromNow
};
