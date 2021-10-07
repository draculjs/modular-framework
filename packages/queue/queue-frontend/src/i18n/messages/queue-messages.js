const messages = {
    en: {
        queue: {
            queue: {
                queue: "Queue",
                title: 'Queue jobs',
                subtitle: '',
                creating: 'Creating Queue',
                editing: 'Editing Queue',
                deleting: 'Deleting Queue',
                showing: 'Showing Job',
                state:{
                    DONE:'DONE',
                    PENDING:'PENDING',
                    WORKING:'WORKING',
                    ERROR:'ERROR',
                },
                labels: {
                    blockedUntil: 'BlockedUntil',
                    workerId: 'Worker Id',
                    maxRetries: 'Max Retries',
                    retries: 'Retries',
                    progress: 'Progress',
                    info: 'Info',
                    output: 'Output',
                    state: 'State',
                    topic: 'Topic',
                    payload: 'Payload',
                    done: 'Done',
                    error: 'Error'
                },

            }
        }
    },
    es: {
        queue: {
            queue: {
                queue: "Cola",
                title: 'Trabajos en cola',
                subtitle: '',
                creating: 'Creando Queue',
                editing: 'Modificando Queue',
                deleting: 'Eliminando Queue',
                showing: 'Detalles del Job',
                state:{
                    DONE:'FINALIZADO',
                    PENDING:'PENDIENTE',
                    WORKING:'PROCESANDO',
                    ERROR:'ERROR',
                },
                labels: {
                    blockedUntil: 'Bloqueado Hasta',
                    workerId: 'Worker Id',
                    maxRetries: 'Intentos Maximos',
                    retries: 'Intentos',
                    progress: 'Progreso',
                    info: 'Info',
                    output: 'Output',
                    state: 'Estado',
                    topic: 'Topico',
                    payload: 'Carga útil',
                    done: 'Listo',
                    error: 'Error'
                },

            }
        }
    },
    pt: {
        queue: {
            queue: {
                queue: "Queue",
                title: 'Trabajos en cola',
                subtitle: '',
                creating: 'Criando Queue',
                editing: 'Edição Queue',
                deleting: 'Apagando Queue',
                showing: 'Detalhes do Job',
                state:{
                    DONE:'FEITO',
                    PENDING:'PENDENTE',
                    WORKING:'EM PROCESSAMENTO',
                    ERROR:'ERRO',
                },
                labels: {
                    blockedUntil: 'Bloqueado até',
                    workerId: 'Worker Id',
                    maxRetries: 'Tentativas máximas',
                    retries: 'Tentativas',
                    progress: 'Progresso',
                    info: 'Info',
                    output: 'Output',
                    state: 'Estado',
                    topic: 'Tema',
                    payload: 'Carga útil',
                    done: 'Feito',
                    error: 'Erro'
                },

            }
        }
    }
}

export default messages
