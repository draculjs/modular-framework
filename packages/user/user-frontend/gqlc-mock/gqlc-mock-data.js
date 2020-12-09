//Mock
import {createMockClient} from 'mock-apollo-client';
const mockGqlClient = createMockClient();

//Resolvers
import dashboardData from "./resolves/dashboardData";
import groupsPaginate from "./resolves/groupsPaginate";
import users from "./resolves/users";
import userPaginate from "./resolves/userPaginate";
import changePasswordAdmin from "./resolves/changePasswordAdmin";
import roles from "./resolves/roles";
import groups from "./resolves/groups";
import permissions from "./resolves/permissions";

import avatarUpload from "./resolves/avatarUpload";
import avatarUploadValidationMaxFileSize from "./resolves/avatarUploadValidationMaxFileSize";


import authSuccessful from "./resolves/auth-successful";
import authBadCredentials from "./resolves/auth-badCredentials";
import recoveryByEmail from "./resolves/recoveryByEmail";
import register from "./resolves/register";
import userCreateUniqueError from "./resolves/userCreateUniqueError";
import apikey from "./resolves/apikey";


//Helpers
import uuidv4 from "./helpers/uuidv4";
import getRoleById from "./helpers/getRoleById";
import getUserById from "./helpers/getUserById";



mockGqlClient.setRequestHandler(
    require('../src/providers/gql/recoveryByEmail.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(recoveryByEmail), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/avatarUpload.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(avatarUploadValidationMaxFileSize), 2000)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/dashboardData.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(dashboardData), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupsPaginate.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(groupsPaginate), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupCreate.graphql'),
    ({name, color, users}) => {
        return new Promise((resolve) => {
            let id = uuidv4()
            users = users.map(user => getUserById(user))
            let group = {id, name, color, users}
            let r = {data: {groupCreate: group }}

            //Actualizo mi base en memoria
            groupsPaginate.data.groupsPaginate.items.push(group)
            groupsPaginate.data.groupsPaginate.totalItems++

            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupUpdate.graphql'),
    ({id, name, color, users}) => {
        return new Promise((resolve) => {
            users = users.map(user => getUserById(user))
            let group = {id, name, color, users}

            //Actualizo mi base en memoria
            let index = groupsPaginate.data.groupsPaginate.items.findIndex(i => i.id == group.id)
            groupsPaginate.data.groupsPaginate.items[index] = group

            let r = {data: {groupUpdate: group }}

            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupDelete.graphql'),
    (id) => {
        return new Promise((resolve) => {
            let r = {data: {groupDelete: {id: id, deleteSuccess: true}}}

            //Actualizo mi base en memoria
            let index = groupsPaginate.data.groupsPaginate.items.findIndex(i => i.id == id)
            groupsPaginate.data.groupsPaginate.items.splice(index,1)
            groupsPaginate.data.groupsPaginate.totalItems--

            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/users.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(users), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userPaginate.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(userPaginate), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userCreate.graphql'),
    ({username, password, name, email, phone, role, groups, active}) => {
        return new Promise((resolve) => {
            let r
            if(username == 'jhon.doe'){
                r = userCreateUniqueError
                resolve(r)
            }else{
                let id = uuidv4()
                role = getRoleById(role)
                let avatarurl = null
                let user = {id, username, password, name, email, phone, role, groups, active, avatarurl}

                //Actualizo mi base en memoria
                userPaginate.data.paginateUsers.users.push(user)
                userPaginate.data.paginateUsers.totalItems++


                 r = {data: {createUser: user}}
            }

            setTimeout(() => {resolve(r)}, 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userUpdate.graphql'),
    ({id, username, password, name, email, phone, role, groups, active}) => {
        return new Promise((resolve) => {
            role = getRoleById(role)
            let avatarurl = null
            let user = {id, username, password, name, email, phone, role, groups, active, avatarurl}
            let r = {data: {updateUser: user }}

            //Actualizo mi base en memoria
            let index = userPaginate.data.paginateUsers.users.findIndex(u => u.id == user.id)
            userPaginate.data.paginateUsers.users[index] = user

            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userDelete.graphql'),
    (id) => {
        return new Promise((resolve) => {
            let r = {data: {deleteUser: {id: id, success: true}}}

            //Actualizo mi base en memoria
            let index = userPaginate.data.paginateUsers.users.findIndex(u => u.id == id)
            userPaginate.data.paginateUsers.users.splice(index,1)
            userPaginate.data.paginateUsers.totalItems--

            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userAdminChangePassword.graphql'),
    () => Promise.resolve(changePasswordAdmin),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(changePasswordAdmin), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roles.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(roles), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groups.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(groups), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roleCreate.graphql'),
    ({name,  childRoles, permissions}) => {
        return new Promise((resolve) => {
            let id = uuidv4()
            let r = {data: {roleCreate: {id, name, childRoles, permissions}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roleUpdate.graphql'),
    ({id, name, childRoles, permissions}) => {
        return new Promise((resolve) => {
            let r = {data: {roleUpdate: {id, name, childRoles, permissions}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roleDelete.graphql'),
    (id) => {
        return new Promise((resolve) => {
            let r = {data: {roleDelete: {id: id, success: true}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);




mockGqlClient.setRequestHandler(
    require('../src/providers/gql/permissions.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(permissions), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/register.graphql'),
    ({email}) => {
        return new Promise((resolve) => {
            register.data.register.email = email
            setTimeout(() => resolve(register), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/auth.graphql'),
    ({username, password}) => {
        return new Promise((resolve) => {
            if(username == "root" && password == "123"){
                setTimeout(() => resolve(authSuccessful), 800)
            }else{
                setTimeout(() => resolve(authBadCredentials), 800)
            }

        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/apikey.graphql'),
    () => {
        return new Promise((resolve) => {
                setTimeout(() => resolve(apikey), 800)

        })
    }
);





export default mockGqlClient