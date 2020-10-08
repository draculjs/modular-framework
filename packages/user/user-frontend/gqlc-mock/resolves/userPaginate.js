const resolve = {
    data: {
        paginateUsers: {
            totalItems: 2,
            page: 1,
            users: [
                {
                    id: 1,
                    username: "john.doe",
                    name: "John Doe",
                    email: "john.doe@gmail.com",
                    role: {id: 1, name: "admin"},
                    phone: "123",
                    avatarurl: "",
                    active: true,
                    groups: []
                },
                {
                    id: 2,
                    username: "jane.doe",
                    name: "Jane Doe",
                    email: "jane.doe@gmail.com",
                    role: {id: 2, name: "supervisor"},
                    phone: "456",
                    avatarurl: "",
                    active: true,
                    groups: []
                }
            ]
        }
    }
}

export default resolve