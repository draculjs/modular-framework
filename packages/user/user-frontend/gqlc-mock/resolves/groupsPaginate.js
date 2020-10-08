const resolve = {
    data: {
        groupsPaginate: {
            totalItems: 2,
            page: 1,
            items: [
                {
                    id: 1,
                    name: "Developers",
                    color: "#00FF00",
                    users: [
                        {id: 1, username: "jhon.doe"},
                        {id: 2, username: "jane.doe"}
                    ]
                },
                {
                    id: 2,
                    name: "Networkers",
                    color: "#00FF00",
                    users: [
                        {id: 1, username: "jhon.doe"}
                    ]
                }
            ]
        }
    }
}

export default resolve