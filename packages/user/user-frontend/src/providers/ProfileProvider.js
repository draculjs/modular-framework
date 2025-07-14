import avatarUploadRaw from './gql/avatarUpload.graphql?raw';
import changePasswordRaw from './gql/changePassword.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const sessionsByUserGql = gql(avatarUploadRaw);
const dashboardDataGql = gql(changePasswordRaw);

class ProfileProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        if (gqlc instanceof ApolloClient) {
            this.gqlc = gqlc;
        } else {
            throw new Error('gqlc must be an ApolloClient instance');
        }
    }

    avatarUpload(file) {
        return this.gqlc.mutate({
            mutation: sessionsByUserGql,
            variables: {
                file: file
            },
        })
    }

    changePassword( currentPassword, newPassword) {
        return this.gqlc.mutate({
            mutation: dashboardDataGql,
            variables: {
                currentPassword: currentPassword,
                newPassword: newPassword
            },
        })
    }


}

const profileProvider = new ProfileProvider()
export default profileProvider

