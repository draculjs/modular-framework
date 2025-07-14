import settingsFindRaw from './gql/settingsFind.graphql?raw';
import settingsFindByKeyRaw from './gql/settingsFindByKey.graphql?raw';
import settingsFetchRaw from './gql/settingsFetch.graphql?raw';
import settingsPaginateRaw from './gql/settingsPaginate.graphql?raw';
import fetchEntityOptionsRaw from './gql/fetchEntityOptions.graphql?raw';
import settingValueUpdateByKeyRaw from './gql/settingValueUpdateByKey.graphql?raw';
import fetchSettingsGroupRaw from './gql/fetchSettingsGroup.graphql?raw';
import { gql } from '@apollo/client/core';

const settingsFindGql = gql(settingsFindRaw);
const settingsFindByKeyGql = gql(settingsFindByKeyRaw);
const settingsFetchGql = gql(settingsFetchRaw);
const settingsPaginateGql = gql(settingsPaginateRaw);
const fetchEntityOptionsGql = gql(fetchEntityOptionsRaw);
const settingValueUpdateByKeyGql = gql(settingValueUpdateByKeyRaw);
const fetchSettingsGroupGql = gql(fetchSettingsGroupRaw);

class SettingsProvider {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc;
    }

    findSettings(id) {
        return this.gqlc.query({
            query: settingsFindGql,
            fetchPolicy: "network-only",
            variables: {id}
        });
    }

    findSettingsByKey(key) {
        return this.gqlc.query({
            query: settingsFindByKeyGql,
            fetchPolicy: "network-only",
            variables: {key}
        });
    }

    fetchSettings() {
        return this.gqlc.query({
            query: settingsFetchGql,
            fetchPolicy: "network-only"
        });
    }

    paginateSettings(pageNumber, itemsPerPage, search = null, orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: settingsPaginateGql,
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        });
    }

    fetchEntityOptions(key) {
        return this.gqlc.query({
            query: fetchEntityOptionsGql,
            variables: {key},
            fetchPolicy: "network-only"
        });
    }

    settingValueUpdateByKey(key, value, valueList) {
        return this.gqlc.mutate({
            mutation: settingValueUpdateByKeyGql,
            variables: {key, value, valueList}
        });
    }

    fetchSettingsGroup() {
        return this.gqlc.query({
            query: fetchSettingsGroupGql,
            fetchPolicy: "no-cache"
        });
    }
}

export default new SettingsProvider();