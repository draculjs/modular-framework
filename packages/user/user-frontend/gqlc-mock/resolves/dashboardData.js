const resolve =
    {
        data:
            {
                sessionsByUser: [
                    {
                        durationAvg: 168.5,
                        durationMin: 147,
                        durationMax: 190,
                        durationLast: 147,
                        durationSum: 337,
                        sessionCount: 2,
                        requestSum: 18,
                        requestAvg: 9,
                        username: "jhon.doe",
                        __typename: "SessionsByUser"
                    }, {
                        durationAvg: 250,
                        durationMin: 250,
                        durationMax: 250,
                        durationLast: 250,
                        durationSum: 250,
                        sessionCount: 1,
                        requestSum: 13,
                        requestAvg: 13,
                        username: "jane.doe",
                        __typename: "SessionsByUser"
                    }
                ],
                sessionsByCountry:
                    [
                        {
                            country: "AR",
                            sum: 80,
                            __typename: "SessionsByCountry"
                        },
                        {
                            country: "BR",
                            sum: 50,
                            __typename: "SessionsByCountry"
                        },
                        {
                            country: "UY",
                            sum: 20,
                            __typename: "SessionsByCountry"
                        }
                    ],
                sessionsByOs:
                    [{
                        osname: "Ubuntu",
                        sum: 60, "__typename": "SessionsByOs"
                    },
                        {
                            osname: "Mac",
                            sum: 20,
                            __typename: "SessionsByOs"
                        },
                        {
                            osname: "Windows",
                            sum: 80,
                            __typename: "SessionsByOs"
                        }
                    ],
                sessionsByDeviceType:
                    [
                        {
                            devicetype: "desktop",
                            sum: 80,
                            __typename: "SessionsByDeviceType"
                        },
                        {
                            devicetype: "tablet",
                            sum: 10,
                            __typename: "SessionsByDeviceType"
                        }
                    ],
                sessionsByClient:
                    [
                        {
                            clientname: "Firefox",
                            sum: 40,
                            __typename: "SessionsByClient"
                        },
                        {
                            clientname: "Chrome",
                            sum: 90,
                            __typename: "SessionsByClient"
                        },
                        {
                            clientname: "Safari",
                            sum: 10,
                            __typename: "SessionsByClient"
                        }
                    ],
                sessionsByCity:
                    [
                        {
                            city: "Buenos Aires",
                            sum: 80,
                            __typename: "SessionsByCity"
                        },
                        {
                            city: "San Paulo",
                            sum: 50,
                            __typename: "SessionsByCity"
                        },
                        {
                            city: "Montevideo",
                            sum: 25,
                            __typename: "SessionsByCity"
                        }
                    ],
                loginFailByUsername: [
                    {
                        username: "admin",
                        attempts: 8,
                    },
                    {
                        username: "jhon.doe",
                        attempts: 3,
                    },
                ],
                userAuditsFrom:
                    [
                        {
                            date: "1590786734068",
                            actionBy: {username: "jhon.doe", __typename: "User"},
                            actionFor: {username: "jhon.doe", __typename: "User"},
                            action: "passwordRecovery",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590518814473",
                            actionBy: {username: "jhon.doe", __typename: "User"},
                            actionFor: {username: "jhon.doe", __typename: "User"},
                            action: "avatarChange",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590514840450",
                            actionBy: {username: "jhon.doe", __typename: "User"},
                            actionFor: {username: "jhon.doe", __typename: "User"},
                            action: "userPasswordChange",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590514573730",
                            actionBy: {username: "root", __typename: "User"},
                            actionFor: {username: "jane.doe", __typename: "User"},
                            action: "adminPasswordChange",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590508179781",
                            actionBy: {username: "root", __typename: "User"},
                            actionFor: {username: "jack.black", __typename: "User"},
                            action: "userDeleted",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590161354432",
                            actionBy: {username: "root", __typename: "User"},
                            actionFor: {username: "jane.doe", __typename: "User"},
                            action: "userModified",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590093222858",
                            actionBy: {username: "root", __typename: "User"},
                            actionFor: {username: "jack.black", __typename: "User"},
                            action: "userCreated",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590093222908",
                            actionBy: {username: "root", __typename: "User"},
                            actionFor: {username: "jane.doe", __typename: "User"},
                            action: "userCreated",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590093222808",
                            actionBy: {username: "root", __typename: "User"},
                            actionFor: {username: "jhon.doe", __typename: "User"},
                            action: "userCreated",
                            __typename: "UserAudit"
                        },
                        {
                            date: "1590093222408",
                            actionBy: null,
                            actionFor: {username: "root", __typename: "User"},
                            action: "userCreated",
                            __typename: "UserAudit"
                        }
                    ]
            }
    }


export default resolve