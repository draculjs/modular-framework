const clientMessages = {
    en: {
        client: {
            error: {
                unauthenticated: 'Authentication required',
                forbidden: 'Forbidden',
                validation: 'Validation Errors',
                networkError: 'Network error. The server does not respond.',
                unexpectedError: 'unexpectedError',
                roleNameAlreadyExists: 'The name chosen for the new role was already taken'
            }
        }
    },
    es: {
        client: {
            error: {
                unauthenticated: 'Autenticación requerida',
                forbidden: 'Prohibido',
                validation: 'Error de validación.',
                networkError: 'Error de Red. El servidor no responde',
                unexpectedError: 'unexpectedError',
                roleNameAlreadyExists: 'El nombre elegido para el nuevo rol ya fue tomado'
            }
        }

    },
    pt: {
        client: {
            error: {
                unauthenticated: 'Authentication required',
                forbidden: 'Forbidden',
                validationError: 'Validation Error',
                networkError: 'networkError',
                unexpectedError: 'unexpectedError',
                roleNameAlreadyExists: 'O nome escolhido para o novo papel já foi assumido'
            }
        }

    }

}

export default clientMessages
