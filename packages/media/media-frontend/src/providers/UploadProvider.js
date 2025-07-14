import fileUploadRaw from './gql/fileUpload.graphql?raw';
import fileUploadAnonymousRaw from './gql/fileUploadAnonymous.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const fileUploadGql = gql(fileUploadRaw);
const fileUploadAnonymousGql = gql(fileUploadAnonymousRaw);

class UploadProvider {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        if (gqlc instanceof ApolloClient) {
            this.gqlc = gqlc;
        } else {
            throw new Error('gqlc must be an ApolloClient instance');
        }
    }

    getGqlClient() {
        if (!this.gqlc) {
            throw new Error('gqlc must be initialized');
        }
        return this.gqlc;
    }

    uploadFile(file, expirationDate, isPublic, description, tags, groups, users) {
        console.log("file: ", file)
        return this.getGqlClient().mutate({
            mutation: fileUploadGql,
            variables: { 
                file, 
                expirationDate, 
                isPublic, 
                description, 
                tags, 
                groups, 
                users 
            }
        });
    }

    uploadFileAnonymous(file) {
        return this.getGqlClient().mutate({
            mutation: fileUploadAnonymousGql,
            variables: { file }
        });
    }
}

const uploadProvider = new UploadProvider();
export default uploadProvider;