import { DefaultLogger, DefaultLogger as winston } from '@dracul/logger-backend';
import { UserInputError } from 'apollo-server-errors';
import bcryptjs from 'bcryptjs';
import EventEmitter from 'events';

import { passwordRules, validateRegexPassword } from './PasswordService.js';
import GroupService from './GroupService.js';
import RoleService from './RoleService.js';
import User from '../models/UserModel.js';

class UserService {
    constructor() {
        this._UserEventEmitter = new EventEmitter();
    }

    set UserEventEmitter(eventEmitter) {
        this._UserEventEmitter = eventEmitter;
    }

    get UserEventEmitter() {
        return this._UserEventEmitter;
    }

    hashPassword(password) {
        if (!password) {
            throw new Error("Password must be provided");
        }
        const salt = bcryptjs.genSaltSync(10);
        return bcryptjs.hashSync(password, salt);
    }

    async _populateUser(user) {
        return user.populate(['role', 'groups']);
    }

    async _handleGroupUpdates(userId, newGroups) {
        const user = await User.findById(userId).populate('groups');
        const currentGroups = user.groups.map(g => g._id.toString());
        
        // Convertir a strings para comparación segura
        const newGroupIds = newGroups.map(g => g.id ? g.id.toString() : g.toString());
        
        const toRemove = currentGroups.filter(
            groupId => !newGroupIds.includes(groupId)
        );
        
        const toAdd = newGroupIds.filter(
            groupId => !currentGroups.includes(groupId)
        );

        for (const groupId of toAdd) {
            await GroupService.addUserToGroup(groupId, userId);
        }

        for (const groupId of toRemove) {
            await GroupService.removeUserToGroup(groupId, userId);
        }
    }

    async restoreDeletedUser(id, userData) {
        try {
            winston.info(`Restoring deleted user ID: ${id}, Username: ${userData.username}`);
            
            // Actualizar grupos primero
            if (userData.groups) {
                await this._handleGroupUpdates(id, userData.groups);
            }
            
            const user = await User.findById(id);
            if (!user) throw new Error('User not found');
            
            // Actualizar campos
            user.name = userData.name.trim();
            user.username = userData.username.trim();
            user.email = userData.email.trim();
            user.password = this.hashPassword(userData.password);
            user.updatedAt = Date.now();
            user.deleted = false;
            user.deletedAt = null;
            
            // Campos adicionales
            if (userData.role) user.role = userData.role;
            if (userData.active !== undefined) user.active = userData.active;
            if (userData.phone) user.phone = userData.phone;
            if (userData.address) user.address = userData.address;
            if (userData.avatar) user.avatar = userData.avatar;

            await user.save();
            
            winston.info(`User restored: ${user.username}`);
            await this._populateUser(user);
            this._UserEventEmitter.emit('updated', user);
            return user;
        } catch (error) {
            if (error.name === "ValidationError") {
                winston.warn("Validation error on restore", error);
                throw new UserInputError(error.message, { inputErrors: error.errors });
            }
            winston.error("User restore error", error);
            throw error;
        }
    }

    async createUser(userData) {
        const { username, email, password } = userData;
        const existingUser = await this.findUserByUsernameOrEmailDeleted(username, email);

        if (existingUser) {
            return this.restoreDeletedUser(existingUser._id, userData);
        }

        if (!validateRegexPassword(password)) {
            throw new UserInputError('auth.invalidPassword', {
                inputErrors: { password: { message: passwordRules.requirements } }
            });
        }

        const newUser = new User({
            ...userData,
            name: userData.name.trim(),
            username: userData.username.trim(),
            email: userData.email.trim(),
            password: this.hashPassword(password),
            createdAt: Date.now(),
            lastPasswordChange: new Date(),
            refreshToken: []
        });

        try {
            await newUser.save();
            
            if (userData.groups?.length) {
                for (const groupId of userData.groups) {
                    await GroupService.addUserToGroup(groupId, newUser._id);
                }
            }

            winston.info(`User created: ${newUser.username}`);
            await this._populateUser(newUser);
            this._UserEventEmitter.emit('created', newUser);
            return newUser;
        } catch (error) {
            if (error.name === "ValidationError") {
                winston.warn("Create user validation error", error);
                throw new UserInputError(error.message, { inputErrors: error.errors });
            }
            winston.error("User creation error", error);
            throw error;
        }
    }

    async updateUser(id, userData) {
        try {
            const user = await User.findById(id);
            if (!user) throw new Error('User not found');
            
            // Actualizar grupos primero
            if (userData.groups) {
                await this._handleGroupUpdates(id, userData.groups);
            }
            
            // Actualizar campos
            user.name = userData.name.trim();
            user.username = userData.username.trim();
            user.email = userData.email.trim();
            user.updatedAt = Date.now();
            
            // Campos opcionales
            if (userData.role) user.role = userData.role;
            if (userData.active !== undefined) user.active = userData.active;
            if (userData.phone) user.phone = userData.phone;
            if (userData.address) user.address = userData.address;
            if (userData.avatar) user.avatar = userData.avatar;

            await user.save();
            
            winston.info(`User updated: ${user.username}`);
            await this._populateUser(user);
            this._UserEventEmitter.emit('updated', user);
            return user;
        } catch (error) {
            if (error.name === "ValidationError") {
                winston.warn("Update user validation error", error);
                throw new UserInputError(error.message, { inputErrors: error.errors });
            }
            winston.error("User update error", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.findUser(id);
            await user.softdelete();
            this._UserEventEmitter.emit('deleted', user);
            return { success: true, id };
        } catch (error) {
            winston.error("User deletion error", error);
            throw error;
        }
    }

    async findUsers(roles = [], userId = null) {
        DefaultLogger.info(`at findUsers!`)
        try {
            const query = roles.length 
                ? { $or: [{ role: { $in: roles } }, { _id: userId }] } 
                : {};
            return await User.find(query).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find users error", error);
            throw error;
        }
    }

    async findUsersByRole(roleName) {
        try {
            const role = await RoleService.findRoleByName(roleName);
            if (!role) return [];
            return await User.find({ role: role.id }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find users by role error", error);
            throw error;
        }
    }

    async findUsersByRoles(roleNames) {
        try {
            const roles = await RoleService.findRoleByNames(roleNames);
            if (!roles?.length) return [];
            return await User.find({ 
                role: { $in: roles.map(r => r._id) } 
            }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find users by roles error", error);
            throw error;
        }
    }

    async paginateUsers(limit, page = 1, search = null, orderBy = null, orderDesc = false, roles = [], activeUsers = false) {
        try {
            const query = { deleted: false };
            
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ];
            }
            
            if (roles.length) query.role = { $in: roles };
            if (activeUsers) query.active = true;
            
            const options = {
                page,
                limit,
                populate: ['role', 'groups'],
                sort: orderBy ? `${orderDesc ? '-' : ''}${orderBy}` : null
            };

            const result = await User.paginate(query, options);
            return {
                users: result.docs,
                totalItems: result.totalDocs,
                page: result.page
            };
        } catch (error) {
            winston.error("Paginate users error", error);
            throw error;
        }
    }

    async findUser(id) {
        try {
            return await User.findById(id).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find user error", error);
            throw error;
        }
    }

    async findUserByUsername(username) {
        try {
            return await User.findOne({ username }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find user by username error", error);
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find user by email error", error);
            throw error;
        }
    }

    async findUserByUsernameOrEmail(username, email) {
        try {
            return await User.findOne({
                $or: [{ username }, { email }]
            }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find user by username/email error", error);
            throw error;
        }
    }

    async findUserByUsernameOrEmailDeleted(username, email) {
        try {
            return await User.findOne({
                $or: [{ username }, { email }],
                deleted: true
            }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find deleted user error", error);
            throw error;
        }
    }

    async changePasswordAdmin(id, passwords) {
        const { password, passwordVerify } = passwords;
        
        if (password !== passwordVerify) {
            throw new Error("Passwords do not match");
        }

        if (!validateRegexPassword(password)) {
            throw new UserInputError('auth.invalidPassword', {
                inputErrors: { password: { message: passwordRules.requirements } }
            });
        }

        try {
            const user = await User.findById(id);
            if (!user) throw new Error('User not found');
            
            user.password = this.hashPassword(password);
            user.lastPasswordChange = new Date();
            await user.save();
            
            return { 
                success: true, 
                message: "Password changed",
                operation: "changePasswordAdmin" 
            };
        } catch (error) {
            winston.error("Password change error", error);
            throw error;
        }
    }

    async findUsersGroup(group, showDeleted = false) {
        try {
            return await User.find({
                groups: group.id,
                deleted: showDeleted
            });
        } catch (error) {
            winston.error("Find group users error", error);
            throw error;
        }
    }

    async setUsersGroups(group, userIds) {
        try {
            const groupId = group.id.toString();
            const currentUsers = await this.findUsersGroup(group);
            const currentUserIds = currentUsers.map(u => u._id.toString());
            
            // Convertir a strings para comparación segura
            const newUserIds = userIds.map(id => id.toString());
            
            // Usuarios a remover
            const toRemove = currentUserIds.filter(id => !newUserIds.includes(id));
            for (const userId of toRemove) {
                await User.findByIdAndUpdate(
                    userId, 
                    { $pull: { groups: groupId } }
                );
            }
            
            // Usuarios a agregar
            const toAdd = newUserIds.filter(id => !currentUserIds.includes(id));
            for (const userId of toAdd) {
                await User.findByIdAndUpdate(
                    userId, 
                    { $addToSet: { groups: groupId } }
                );
            }
            
            return true;
        } catch (error) {
            winston.error("Set users groups error", error);
            throw error;
        }
    }

    async findUserByRefreshToken(tokenId) {
        try {
            return await User.findOne({
                active: true,
                'refreshToken.id': tokenId,
                'refreshToken.expiryDate': { $gte: new Date() }
            }).populate(['role', 'groups']).exec();
        } catch (error) {
            winston.error("Find user by token error", error);
            throw error;
        }
    }
}

const userService = new UserService();
export default userService;