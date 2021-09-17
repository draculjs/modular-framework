import {createMockClient} from 'mock-apollo-client';
const mockGqlClient = createMockClient();


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/queueStats.graphql'),
    () => {
        return new Promise((resolve) => {

            let response = {
                data: {
                    queueStats: [
                        {topic: 'ImportCSV', added: 5, gotten: 2, failed: 0, done: 1 },
                        {topic: 'BatchCampaign', added: 8, gotten: 7, failed: 2, done: 5 }
                    ]
                }
            }


            setTimeout(() => resolve(response), 3500)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/queuePaginate.graphql'),
    () => {
        return new Promise((resolve) => {

            let response = {
                "data":
                    {
                        "queuePaginate":
                            {
                                "totalItems":1,
                                "page":1,
                                "items":
                                    [
                                        {"id":"6143f326d88fde5e72802ee4","blockedUntil":"1631844036112","workerId":"ImportarDeudaWorker","maxRetries":3,"retries":2,"progress":100,"info":null,"output":null,"state":"DONE","topic":"ImportarDeuda","payload":{"fileId":"6143f326d88fde5e72802ee3"},"done":true,"error":null,"__typename":"Queue"}
                                        ],
                                "__typename":"QueuePaginated"
                            }
                    }
            }



            setTimeout(() => resolve(response), 3500)
        })
    }
);

export default mockGqlClient;
