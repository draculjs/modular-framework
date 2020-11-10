import {apolloClientWs, apolloClient} from "../../../apollo";

class notificationProvider {

  markAsReadOrNotRead(id, isRead) {
    return apolloClient.mutate({
      mutation: require("./gql/markAsReadOrNotRead.graphql"),
      variables: {
        id,
        isRead
      },
    });
  }

  markAllReadOrNotRead(isRead) {
    return apolloClient.mutate({
      mutation: require("./gql/markAllReadOrNotRead.graphql"),
      variables:{
        isRead
      }
    });
  }

  fetchNotifications(limit, isRead, type) {
    return apolloClient.query({
      query: require("./gql/fetchNotifications.graphql"),
      variables: { limit, isRead, type },
      fetchPolicy: "network-only"
    });
  }

  notificationsPaginateFilter(limit, pageNumber, isRead, type){
    return apolloClient.query({
      query: require("./gql/notificationsPaginate.graphql"),
      variables:{limit, pageNumber, isRead, type}
    })
  }

  createNotification(title,content,type,icon){
    return apolloClient.mutate({
      mutation: require("./gql/createNotification.graphql"),
      variables:{
        title, content,type,icon
      }
    })
  }

  subscriptionNotification(user){
    return apolloClientWs.subscribe({
      query: require("./gql/subscriptionNotification.graphql"),
      variables:{user}
    })
  }
}

export default new notificationProvider();
