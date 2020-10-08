import {createMockClient} from "mock-apollo-client";

const mockGqlClient = createMockClient();

mockGqlClient.setRequestHandler(
    require('../../../src/providers/gql/auth.graphql'),
    () => Promise.reject(new Error('GraphQL Network Error'))
);


export default mockGqlClient