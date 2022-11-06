import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { fetchUserStorage, updateUserStorage, findUserStorage, findUserStorageByUser } from "../../services/UserStorageService";
import { USER_STORAGE_SHOW_ALL, USER_STORAGE_SHOW_OWN, USER_STORAGE_UPDATE } from "../../permissions/UserStorage"

export default {
  Query: {
    userStorageFetch: (_, { }, { user, rbac }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, USER_STORAGE_SHOW_ALL)) throw new ForbiddenError("Not Authorized");
      return fetchUserStorage();
    },
    userStorageFindByUser: (_, { }, { user, rbac }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, USER_STORAGE_SHOW_OWN)) throw new ForbiddenError("Not Authorized");
      return findUserStorageByUser(user);
    },
    fetchMediaVariables: (_, { }) => {
      return Promise.resolve(
          {
            maxFileSize: process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024,
            fileExpirationTime: process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365
          }
      )
    },
  },
  Mutation: {
    userStorageUpdate: (_, { id, input }, { user, rbac }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      if (!rbac.isAllowed(user.id, USER_STORAGE_UPDATE)) throw new ForbiddenError("Not Authorized");
      return updateUserStorage(user, id, input);
    },
  },

};
