import rolesResolve from '../resolves/users'
const getUserById = (id)=>{
    return rolesResolve.data.users.find(i => i.id ==id)
}

export default getUserById