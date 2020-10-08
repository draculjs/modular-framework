//i18n Messages
const MESSAGE_GENERIC_ERROR = "client.error.unexpectedError"
const MESSAGE_NETWORK_ERROR = "client.error.networkError"
const MESSAGE_VALIDATION = "client.error.validation"
const MESSAGE_FORBIDDEN = "client.error.forbidden"
const MESSAGE_UNAUTHENTICATED = "client.error.unauthenticated"

//Apollo Errors
const BAD_USER_INPUT = "BAD_USER_INPUT"
const FORBIDDEN = "FORBIDDEN"
const UNAUTHENTICATED = "UNAUTHENTICATED"

class ClientError extends Error {
    constructor(error) {
        super(error.message);
        this.name = "ClientError"
        this.code = null
        this.errorMessage = null

        this.inputErrors = {}
        this.errorsQuantity= null
        //Last error message
        this.i18nMessage = ""
        //TODO @deprecated backward compability
        this.showMessage = ""
        //All userMessages
        this.i18nMessages = []

        //NETWORK ERROR
        if (error.networkError) {
            this.i18nMessage = MESSAGE_NETWORK_ERROR
            this.showMessage = MESSAGE_NETWORK_ERROR

            this.i18nMessages.push(MESSAGE_NETWORK_ERROR)
        //GRAPHQL ERROR
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            this.processFrapjQLErrors(error.graphQLErrors)

        //OTHERS ERROR
        } else {
            this.i18nMessage = MESSAGE_GENERIC_ERROR
            this.showMessage = MESSAGE_GENERIC_ERROR
            this.i18nMessages.push(MESSAGE_GENERIC_ERROR)
        }
    }

    processFrapjQLErrors(graphQLErrors) {
        
        this.errorsQuantity = graphQLErrors.length
        
        graphQLErrors.forEach(gqlError => {

            //BAD_USER_INPUT
            if (gqlError.extensions.code == BAD_USER_INPUT) {
                this.code = BAD_USER_INPUT
                this.errorMessage = gqlError.message

                this.i18nMessage = MESSAGE_VALIDATION
                this.showMessage = MESSAGE_VALIDATION

                this.i18nMessages.push(MESSAGE_VALIDATION)


                for(let inputError in gqlError.extensions.inputErrors ){
                    if(this.inputErrors[inputError] === undefined) {
                        this.inputErrors[inputError] = [gqlError.extensions.inputErrors[inputError].properties.message]
                    }else{
                        this.inputErrors[inputError].push(gqlError.extensions.inputErrors[inputError].properties.message)
                    }
                }

            }

            //FORBIDDEN
            else if (gqlError.extensions.code == FORBIDDEN) {
                this.code = FORBIDDEN
                this.errorMessage = gqlError.message

                this.i18nMessage = MESSAGE_FORBIDDEN
                this.showMessage = MESSAGE_FORBIDDEN
                this.i18nMessages.push(MESSAGE_FORBIDDEN)
            }

            //UNAUTHENTICATED
            else if (gqlError.extensions.code == UNAUTHENTICATED) {

                this.code = UNAUTHENTICATED
                this.errorMessage = gqlError.message

                this.i18nMessage = MESSAGE_UNAUTHENTICATED
                this.showMessage = MESSAGE_UNAUTHENTICATED
                this.i18nMessages.push(MESSAGE_UNAUTHENTICATED)
            }

            //OTHERS
            else {
                this.code = gqlError.extensions.code
                this.errorMessage = gqlError.message
                this.i18nMessage = MESSAGE_GENERIC_ERROR
                this.showMessage = MESSAGE_GENERIC_ERROR
                this.i18nMessages.push(MESSAGE_GENERIC_ERROR)
            }

        })
    }


}

module.exports = ClientError;