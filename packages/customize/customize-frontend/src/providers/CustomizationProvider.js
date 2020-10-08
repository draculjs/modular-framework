class CustomizationProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }


    customization() {
        return this.gqlc.query({
            query: require('./gql/customization.graphql')
        })
    }
    
    

    updateCustomization(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/customizationUpdate.graphql'),
            variables: form
        })
    }

    updateColors(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/colorsUpdate.graphql'),
            variables: form
        })
    }

    updateLogo(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/logoUpdate.graphql'),
            variables: form
        })
    }

    updateLanguage(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/langUpdate.graphql'),
            variables: form
        })
    }

    logoUpload(file) {
        return this.gqlc.mutate({
            mutation: require('./gql/logoUpload.graphql'),
            variables: {file}
        })
    }

}

const customizationProvider = new CustomizationProvider()

export default customizationProvider

