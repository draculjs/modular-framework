import markAsReadOrNotReadRaw from "./gql/markAsReadOrNotRead.graphql?raw";
import markAllReadOrNotReadRaw from "./gql/markAllReadOrNotRead.graphql?raw";
import fetchNotificationsRaw from "./gql/fetchNotifications.graphql?raw";
import notificationsPaginateRaw from "./gql/notificationsPaginate.graphql?raw";
import fetchNotificationMethodRaw from "./gql/fetchNotificationMethod.graphql?raw";
import createNotificationRaw from "./gql/createNotification.graphql?raw";
import subscriptionNotificationRaw from "./gql/subscriptionNotification.graphql?raw";
import { ApolloClient, gql } from '@apollo/client/core';

const markAsReadOrNotReadGql = gql(markAsReadOrNotReadRaw);
const markAllReadOrNotReadGql = gql(markAllReadOrNotReadRaw);
const fetchNotificationsGql = gql(fetchNotificationsRaw);
const notificationsPaginateGql = gql(notificationsPaginateRaw);
const fetchNotificationMethodGql = gql(fetchNotificationMethodRaw);
const createNotificationGql = gql(createNotificationRaw);
const subscriptionNotificationGql = gql(subscriptionNotificationRaw);

class NotificationProvider {
    constructor() {
        this.gqlcWs = null;
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        if (gqlc instanceof ApolloClient) {
            this.gqlc = gqlc;
        } else {
            throw new Error('gqlc must be an ApolloClient instance');
        }
    }

    setGqlcWs(gqlcWs) {
        if (gqlcWs instanceof ApolloClient) {
            this.gqlcWs = gqlcWs;
        } else {
            throw new Error('gqlcWs must be an ApolloClient instance');
        }
    }

    getGqlClient() {
        if (!this.gqlc) throw new Error('gqlc must be initialized');
        return this.gqlc;
    }

    getGqlWsClient() {
        if (!this.gqlcWs) throw new Error('gqlcWs must be initialized');
        return this.gqlcWs;
    }

    markAsReadOrNotRead(id, isRead) {
        return this.getGqlClient().mutate({
            mutation: markAsReadOrNotReadGql,
            variables: { id, isRead }
        });
    }

    markAllReadOrNotRead(isRead) {
        return this.getGqlClient().mutate({
            mutation: markAllReadOrNotReadGql,
            variables: { isRead }
        });
    }

    fetchNotifications(limit, isRead, type) {
        return this.getGqlClient().query({
            query: fetchNotificationsGql,
            variables: { limit, isRead, type },
            fetchPolicy: "network-only"
        });
    }

    notificationsPaginateFilter(limit, pageNumber, isRead, type) {
        return this.getGqlClient().query({
            query: notificationsPaginateGql,
            variables: { limit, pageNumber, isRead, type },
            fetchPolicy: "network-only"
        });
    }

    fetchNotificationMethod() {
        return this.getGqlClient().query({
            query: fetchNotificationMethodGql,
            fetchPolicy: "network-only"
        });
    }

    createNotification(title, content, type, icon) {
        return this.getGqlClient().mutate({
            mutation: createNotificationGql,
            variables: { title, content, type, icon }
        });
    }

    subscriptionNotification(user) {
        return this.getGqlWsClient().subscribe({
            query: subscriptionNotificationGql,
            variables: { user }
        });
    }
}

export default new NotificationProvider();