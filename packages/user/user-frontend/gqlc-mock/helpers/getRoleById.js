import rolesResolve from '../resolves/roles'
const getRoleById = (id)=>{
    return rolesResolve.data.roles.find(i => i.id ==id)
}

export default getRoleById