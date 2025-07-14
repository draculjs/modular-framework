import customizationRaw from './gql/customization.graphql?raw';
import customizationUpdateRaw from './gql/customizationUpdate.graphql?raw';
import colorsUpdateRaw from './gql/colorsUpdate.graphql?raw';
import logoUpdateRaw from './gql/logoUpdate.graphql?raw';
import langUpdateRaw from './gql/langUpdate.graphql?raw';
import logoUploadRaw from './gql/logoUpload.graphql?raw';
import { gql } from '@apollo/client/core';

const customizationGql = gql(customizationRaw);
const customizationUpdateGql = gql(customizationUpdateRaw);
const colorsUpdateGql = gql(colorsUpdateRaw);
const logoUpdateGql = gql(logoUpdateRaw);
const langUpdateGql = gql(langUpdateRaw);
const logoUploadGql = gql(logoUploadRaw);

class CustomizationProvider {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc;
    }

    customization() {
        return this.gqlc.query({
            query: customizationGql
        });
    }

    updateCustomization(form) {
        return this.gqlc.mutate({
            mutation: customizationUpdateGql,
            variables: form
        });
    }

    updateColors(input) {
        return this.gqlc.mutate({
            mutation: colorsUpdateGql,
            variables: {input}
        });
    }

    updateLogo(form) {
        return this.gqlc.mutate({
            mutation: logoUpdateGql,
            variables: form
        });
    }

    updateLanguage(form) {
        return this.gqlc.mutate({
            mutation: langUpdateGql,
            variables: form
        });
    }

    logoUpload(file) {
        return this.gqlc.mutate({
            mutation: logoUploadGql,
            variables: {file}
        });
    }
}

const customizationProvider = new CustomizationProvider();
export default customizationProvider;