import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { fetchUserStorage, updateUserStorage } from "../../services/UserStorageService";

export default {
  Query: {
    userStorageFetch: (_, {}, { user, rbac }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      // if (!rbac.isAllowed(user.id, APIGOOGLEACCOUNT_SHOW)) throw new ForbiddenError("Not Authorized");
      return fetchUserStorage();
    }
  },
  Mutation: {
    userStorageUpdate: (_, { id, input }, { user, rbac }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      // if (!rbac.isAllowed(user.id, APIGOOGLEACCOUNT_UPDATE)) throw new ForbiddenError("Not Authorized");
      return updateUserStorage(user, id, input);
    },
  },

};
