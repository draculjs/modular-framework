
class notificationProvider {

  constructor() {
    this.gqlcWs = null;
    this.gqlc = null;
  }

  setGqlc(gqlc) {
    this.gqlc = gqlc;
  }

  setGqlcWs(gqlc) {
    this.gqlcWs = gqlc;
  }

  markAsReadOrNotRead(id, isRead) {
    return this.gqlc.mutate({
      mutation: require("./gql/markAsReadOrNotRead.graphql"),
      variables: {
        id,
        isRead,
      },
    });
  }

  markAllReadOrNotRead(isRead) {
    return this.gqlc.mutate({
      mutation: require("./gql/markAllReadOrNotRead.graphql"),
      variables: {
        isRead,
      },
    });
  }

  fetchNotifications(limit, isRead, type) {
    return this.gqlc.query({
      query: require("./gql/fetchNotifications.graphql"),
      variables: { limit, isRead, type },
      fetchPolicy: "network-only",
    });
  }

  notificationsPaginateFilter(limit, pageNumber, isRead, type) {
    return this.gqlc.query({
      query: require("./gql/notificationsPaginate.graphql"),
      variables: { limit, pageNumber, isRead, type },
    });
  }

  createNotification(title, content, type, icon) {
    return this.gqlc.mutate({
      mutation: require("./gql/createNotification.graphql"),
      variables: {
        title,
        content,
        type,
        icon,
      },
    });
  }

  subscriptionNotification(user) {
    return this.gqlcWs.subscribe({
      query: require("./gql/subscriptionNotification.graphql"),
      variables: { user },
    });
  }
}

export default new notificationProvider();
