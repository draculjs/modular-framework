const messages = {
    en: {
        error: {
            general: 'Unexpected failure',
            code: {
                FORBIDDEN: 'Forbidden',
                UNAUTHENTICATED: 'Unauthenticated',
                INTERNAL_SERVER_ERROR: "Server Error",
                BAD_USER_INPUT: "Invalid input",
                NETWORK_ERROR: "Network error",
                GRAPHQL_VALIDATION_FAILED: "GRAPHQL_VALIDATION_FAILED"
            }

        }
    },
    es: {
        error: {
            general: 'Fallo inesperado',
            code: {
                FORBIDDEN: 'No Autorizado',
                UNAUTHENTICATED: 'No Autenticado',
                INTERNAL_SERVER_ERROR: "Error Interno",
                BAD_USER_INPUT: "Datos Inválidos",
                NETWORK_ERROR: "Error de Comunicacion",
                GRAPHQL_VALIDATION_FAILED: "GRAPHQL_VALIDATION_FAILED"
            }
        }
    },
    pt: {
        error: {
            general: 'Falha inesperada',
            code: {
                FORBIDDEN: 'Proibido',
                UNAUTHENTICATED: 'Não autenticado',
                INTERNAL_SERVER_ERROR: "erro de servidor",
                BAD_USER_INPUT: "Entrada inválida",
                NETWORK_ERROR: "Erro de rede",
                GRAPHQL_VALIDATION_FAILED: "GRAPHQL_VALIDATION_FAILED"
            }
        }
    }
}

export default messages
