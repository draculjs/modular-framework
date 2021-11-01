import { fetchUserStorage, createUserStorage } from "../modules/media/services/UserStorageService";
import {UserService} from '@dracul/user-backend'

export const initUserStorage = async () => {
    let existingUserStorages = await fetchUserStorage();
    let users = await UserService.findUsers()

    return(checkAndCreate(existingUserStorages, users))
};

const checkAndCreate = async function (existingUserStorages,users) {
    for (let index = 0; index < users.length; index++) {
        if(existingUserStorages.every( x => x.User.id != users[index].id)){
            let user= users[index].id
            let capacity = 0
            await createUserStorage(user, capacity)
        }
    }
    return true
}