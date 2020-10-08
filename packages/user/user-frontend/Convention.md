~~~~## CRUD COMPONENTS

### Components name by Operation

- **main**:       EntitynameCrud.vue    
- **create**:     EntitynameCreate.vue    
- **update**:     EntitynameUpdate.vue    
- **delete**:     EntitynameDelete.vue    
- **read list**:  EntitynameList.vue    
- **read one**:   EntitynameShow.vue    

#### Example with entity User
```
- main:       UserCrud.vue  
- create:     UserCreate.vue    
- update:     UserUpdate.vue    
- delete:     UserDelete.vue    
- read list:  UserList.vue    
- read one:   UserShow.vue    
```

### Components events emitted when an operation is successful

- **create**:     $emit('entitynameCreated', entity)  
- **update**:     $emit('entitynameUpdated', entity)  
- **delete**:     $emit('entitynameDeleted', entity)  

#### Example with entity User

```
create:     $emit('userCreated', user)  
update:     $emit('userUpdated', user)  
delete:     $emit('userDeleted', user)  
```
### Main Crud methods linked to the events of each operation

- **create**:     onEntitynameCreated(entity)
- **update**:     onEntitynameUpdated(entity)  
- **delete**:     onEntitynameDeleted(entity) 

#### Example with entity User
```
- create:     onUserCreated(user)
- update:     onUserUpdated(user)  
- delete:     onUserDeleted(user)  
```