import {createMockClient} from "mock-apollo-client";

const mockGqlClient = createMockClient();

import badCredentialsResolve from '../../resolves/auth-badCredentials'

mockGqlClient.setRequestHandler(
    require('../../../src/providers/gql/auth.graphql'),
    () => Promise.resolve(badCredentialsResolve)
);


export default mockGqlClient