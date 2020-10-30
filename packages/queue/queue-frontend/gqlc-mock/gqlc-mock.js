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

export default mockGqlClient;
