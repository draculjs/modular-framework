import {createMockClient} from 'mock-apollo-client';
import logoUploadValidationMaxFileSize from "../../../customize/customize-frontend/gqlc-mock/resolves/logoUploadValidationMaxFileSize";

const mockGqlClient = createMockClient();

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/logoUpload.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(logoUploadValidationMaxFileSize), 2000)
        })
    }
);


export default mockGqlClient;
