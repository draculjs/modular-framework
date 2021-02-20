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
                    avatarurl: "https://firebasestorage.googleapis.com/v0/b/fullstack-extraordinary.appspot.com/o/VladDracula.jpg?alt=media&token=8288b458-692a-4630-a331-a89a2292d5b6",
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
                    avatarurl: null,
                    active: true,
                    groups: []
                }
            ]
        }
    }
}

export default resolve
