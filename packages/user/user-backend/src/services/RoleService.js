import { DefaultLogger as winston } from '@dracul/logger-backend';
import { CustomApolloError } from '@dracul/common-backend';
import { UserInputError } from 'apollo-server-errors';
import RoleModel from '../models/RoleModel.js';

class RoleService {
    async fetchRolesInName(roleNames) {
        try {
            return await RoleModel.find({
                name: { 
                    $in: roleNames.map(name => new RegExp(`^${name}$`, 'i'))
                }
            }).exec();
        } catch (error) {
            winston.error("Fetch roles by names error", error);
            throw error;
        }
    }

    async findRoles(roleIds = []) {
        try {
            const query = roleIds.length 
                ? { _id: { $in: roleIds } } 
                : {};
                
            return await RoleModel.find(query)
                .isDeleted(false)
                .exec();
        } catch (error) {
            winston.error("Find roles error", error);
            throw error;
        }
    }

    async findRole(id) {
        try {
            return await RoleModel.findById(id).exec();
        } catch (error) {
            winston.error("Find role error", error);
            throw error;
        }
    }

    async findRoleByName(roleName) {
        try {
            return await RoleModel.findOne({ name: roleName }).exec();
        } catch (error) {
            winston.error("Find role by name error", error);
            throw error;
        }
    }

    async findRoleByNames(roleNames) {
        try {
            return await RoleModel.find({
                name: { $in: roleNames }
            }).exec();
        } catch (error) {
            winston.error("Find roles by names error", error);
            throw error;
        }
    }

    async deleteRole(id) {
        try {
            const role = await this.findRole(id);
            await role.softdelete();
            return { id, success: true };
        } catch (error) {
            winston.error("Delete role error", error);
            throw error;
        }
    }

    async #roleNameExists(name, excludeId = null) {
        try {
            const query = { 
                name: { $regex: `^${name}$`, $options: 'i' } 
            };
            
            if (excludeId) {
                query._id = { $ne: excludeId };
            }
            
            const count = await RoleModel.countDocuments(query);
            return count > 0;
        } catch (error) {
            winston.error("Role name exists check error", error);
            throw error;
        }
    }

    async createRole({ name, childRoles, permissions, readonly }) {
        try {
            const nameExists = await this.#roleNameExists(name);
            if (nameExists) throw new CustomApolloError('roleNameAlreadyTaken');

            const newRole = new RoleModel({
                name,
                childRoles,
                permissions,
                readonly
            });
            
            await newRole.save();
            return newRole;
        } catch (error) {
            if (error.code === 11000) {
                // MongoDB duplicate key error
                throw new CustomApolloError('roleNameAlreadyTaken');
            }
            
            if (error.name === "ValidationError") {
                winston.warn("Create role validation error", error);
                throw new UserInputError(error.message, { 
                    inputErrors: error.errors 
                });
            }
            
            winston.error("Create role error", error);
            throw error;
        }
    }

    async updateRole(id, { name, childRoles, permissions, readonly }) {
        try {
            const role = await RoleModel.findById(id);
            if (!role) throw new Error('Role not found');
            
            if (name && name !== role.name) {
                const nameExists = await this.#roleNameExists(name, id);
                if (nameExists) throw new CustomApolloError('roleNameAlreadyTaken');
                role.name = name;
            }
            
            if (childRoles !== undefined) role.childRoles = childRoles;
            if (permissions !== undefined) role.permissions = permissions;
            if (readonly !== undefined) role.readonly = readonly;

            await role.save();
            return role;
        } catch (error) {
            if (error.code === 11000) {
                // MongoDB duplicate key error
                throw new CustomApolloError('roleNameAlreadyTaken');
            }
            
            if (error.name === "ValidationError") {
                winston.warn("Update role validation error", error);
                throw new UserInputError(error.message, { 
                    inputErrors: error.errors 
                });
            }
            
            winston.error("Update role error", error);
            throw error;
        }
    }
}

export default new RoleService();