class RBAC {

    constructor(rolesConfig, debug = false) {
        this.debug = debug
        this.users = {}
        this.roles = {}
        this.debug = debug;

        if (rolesConfig !== undefined) {
            this.roles = rolesConfig.reduce(
                (accumulator, item) => {
                    accumulator[item.name] = item.permissions;
                    return accumulator;
                },
                {}
            );

        } else {
            throw new Error('You must provide a config array with roles and permissions')
        }
    }


    getUserRoles(userId) {
        if (userId === undefined) {
            throw new Error('userId is not defined, expected 1 arguments');
        }

        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId];
        } else {
            throw new Error(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    addUserRoles(userId, roles = []) {
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            return this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }

        for (let i = 0; i < roles.length; i++) {
            if (typeof this.roles[roles[i]] !== 'undefined') {
                if (this.users[userId]) {
                    if (!this.users[userId].includes(roles[i])) {
                        this.users[userId].push(roles[i]);
                    }
                } else {
                    this.users[userId] = [roles[i]];
                }
            } else {
                throw new Error(roles[i] + ' role is not defined in initial config');
            }
        }
    }


    removeUserRoles(userId, roles = []) {
        if (typeof userId === 'undefined') {
            throw new Error('userId is not defined, expected 1 arguments');
        }

        if (typeof roles !== 'Array') {
            throw new Error('roles must be an Array');
        }

        if (this.users[userId]) {
            if (typeof roles === 'undefined') {
                delete this.users[userId];
            } else {
                for (let i = 0; i < roles.length; i++) {
                    const roleIndex = this.users[userId].indexOf(roles[i]);
                    if (roleIndex + 1) {
                        this.users[userId].splice(roleIndex, 1);
                    }
                }
            }
        } else {
            throw new Error(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }

    }

    isAllowed(userId, permission) {
        if (typeof userId === 'undefined' || typeof permission === 'undefined') {
            throw new Error('userId or permission is not defined, expected 2 arguments');
        }

        const user = this.users[userId];

        if (typeof user !== 'undefined') {
            return user.some(userRole => this.roles[userRole].includes(permission));
        } else {
            throw new Error(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    extendRole(role, extendingRoles) {
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            throw new Error('role or extendingRoles is not defined, expected 2 arguments');
        }

        if (typeof this.roles[role] !== 'undefined') {
            for (let i = 0; i < extendingRoles.length; i++) {
                if (this.roles[extendingRoles[i]]) {
                    this.roles[role] = this.roles[role].concat(this.roles[extendingRoles[i]]);
                } else {
                    throw new Error(role + ' role is not defined in initial config');
                }
            }
        } else {
            throw new Error(role + ' role is not defined in initial config');
        }
    }

    middleware({userId, permissionId}, error, success) {
        if (typeof userId === 'undefined' ||
            typeof permissionId === 'undefined' ||
            typeof error === 'undefined' ||
            typeof success === 'undefined'
        ) {
            error();
            throw new Error('one of incoming parameters is not defined, expected 3 arguments');
        }

        if (this.isAllowed(userId, permissionId)) {
            success();
        } else {
            error();
        }
    }
}

export default RBAC;
