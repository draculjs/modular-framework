import {createMockClient} from 'mock-apollo-client';
import Symbol_observable from 'symbol-observable';

const mockGqlClient = createMockClient();

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/fetchNotifications.graphql'),
    () => {
        return new Promise((resolve) => {

            let response = {
                    data:{
                       fetchNotifications:[
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

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/subscriptionNotification.graphql'),
    () => {

        let response = {data: {notification: {"id":"5fa2e09c31fb4800105d3fa9",
                    "title":"Notificacion por subscription",
                    "content":"Contenido por subscription",
                    "read":false,
                    "creationDate":"1604509852455",
                    "type":"ImportCSV",
                    "icon":"publish",
                    "readDate":null,
                    "__typename":"Notification"}}}

    let someObject = {}

        someObject[Symbol_observable] = () => {
            return {
                subscribe(observer) {
                    const handler = e => observer.next(e);
                    someObject.addEventListener('data', handler);
                    return {
                        unsubscribe() {
                            someObject.removeEventListener('data', handler);
                        }
                    }
                },
                [Symbol_observable]() { return this }
            }
        }

        return Promise.resolve({subscribe: function(handler){

            setTimeout(() => {
                handler(response)
            }, 8000 )

        }})
    }
);

export default mockGqlClient;
