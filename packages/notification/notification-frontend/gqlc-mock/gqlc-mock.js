import {createMockClient} from 'mock-apollo-client';
const mockGqlClient = createMockClient();

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/fetchNotifications.graphql'),
    () => {
        return new Promise((resolve) => {

            let response = {
                    "data":{
                       "fetchNotifications":[
                          {
                             "id":"5fa2e09c31fb4800105d3fa9",
                             "title":"Titulo de ejemplo",
                             "content":"Contenido de ejemplo",
                             "read":false,
                             "creationDate":"1604509852455",
                             "type":"ImportCSV",
                             "icon":"publish",
                             "readDate":null,
                             "__typename":"Notification"
                          },
                       ]
                    }
            }

            setTimeout(() => resolve(response), 3500)
        })
    }
);

export default mockGqlClient;
