import { DefaultLogger as winston } from '@dracul/logger-backend';
import { UserInputError } from 'apollo-server-errors';

import Group from '../models/GroupModel.js';
import userService from './UserService.js';

export class GroupService {
    addUserToGroup(groupId, userId) {
        return Group.findByIdAndUpdate(
            groupId,
            { $addToSet: { users: userId } },
            { new: true, useFindAndModify: false }
        );
    }

    removeUserToGroup(groupId, userId) {
        return Group.findByIdAndUpdate(
            groupId,
            { $pull: { users: userId } },
            { new: true, useFindAndModify: false }
        );
    }

    async fetchGroups() {
        try {
            return await Group.find({ deleted: false })
                .populate('users')
                .exec();
        } catch (error) {
            winston.error("Fetch groups error", error);
            throw error;
        }
    }

    async fetchMyGroups(userId) {
        try {
            return await Group.find({
                users: { $in: [userId] },
                deleted: false
            })
            .populate('users')
            .exec();
        } catch (error) {
            winston.error("Fetch user groups error", error);
            throw error;
        }
    }

    async paginateGroup(limit, page = 1, search = null, orderBy = null, 
                       orderDesc = false, includesUser = null, showDeletedUsers = false) {
        try {
            const query = { deleted: false };
            const orConditions = [];
            
            if (includesUser) {
                orConditions.push({ users: { $in: [includesUser] } });
            }
            
            if (search) {
                orConditions.push({ name: { $regex: search, $options: 'i' } });
            }
            
            if (orConditions.length) {
                query.$or = orConditions;
            }
            
            const sort = orderBy ? `${orderDesc ? '-' : ''}${orderBy}` : null;
            const options = {
                page,
                limit,
                sort,
                populate: null
            };
            
            const result = await Group.paginate(query, options);
            
            // Populate users with proper deletion status
            const populatedDocs = await Promise.all(
                result.docs.map(async group => {
                    group.users = await userService.findUsersGroup(group, showDeletedUsers);
                    return group;
                })
            );
            
            return {
                items: populatedDocs,
                totalItems: result.totalDocs,
                page: result.page
            };
        } catch (error) {
            winston.error("Paginate groups error", error);
            throw error;
        }
    }

    async findGroup(id) {
        try {
            return await Group.findById(id)
                .populate('users')
                .exec();
        } catch (error) {
            winston.error("Find group error", error);
            throw error;
        }
    }

    async findGroupByName(name) {
        try {
            return await Group.findOne({ 
                name: { $eq: name },
                deleted: false 
            })
            .populate('users')
            .exec();
        } catch (error) {
            winston.error("Find group by name error", error);
            throw error;
        }
    }

    async createGroup(actionUser, { name, color, users }) {
        try {
            const existingGroup = await this.findGroupByName(name);
            if (existingGroup) {
                throw new UserInputError('Group validation failed', {
                    inputErrors: {
                        name: { 
                            message: 'Group name must be unique',
                            value: name
                        }
                    }
                });
            }

            const group = new Group({ name, color, users });
            await group.save();
            
            // Add users to group
            await userService.setUsersGroups(group, users);
            
            // Populate users
            group.users = await userService.findUsersGroup(group);
            return group;
            
        } catch (error) {
            if (error.name === "ValidationError") {
                winston.warn("Create group validation error", error);
                throw new UserInputError(error.message, { inputErrors: error.errors });
            }
            winston.error("Create group error", error);
            throw error;
        }
    }

    async updateGroup(actionUser, id, { name, color, users = [] }) {
        try {
            const existingGroup = await this.findGroupByName(name);
            if (existingGroup && existingGroup._id.toString() !== id) {
                throw new UserInputError('Group validation failed', {
                    inputErrors: {
                        name: { 
                            message: 'Group name must be unique',
                            value: name
                        }
                    }
                });
            }

            const group = await Group.findByIdAndUpdate(
                id,
                { name, color, users },
                { new: true, runValidators: true }
            ).exec();
            
            // Update group membership
            await userService.setUsersGroups(group, users);
            
            // Populate users
            group.users = await userService.findUsersGroup(group);
            return group;
            
        } catch (error) {
            if (error.name === "ValidationError") {
                winston.warn("Update group validation error", error);
                throw new UserInputError(error.message, { inputErrors: error.errors });
            }
            winston.error("Update group error", error);
            throw error;
        }
    }

    async deleteGroup(id) {
        try {
            const group = await this.findGroup(id);
            await group.softdelete();
            return { id, deleteSuccess: true };
        } catch (error) {
            winston.error("Delete group error", error);
            throw error;
        }
    }
}

export default new GroupService();