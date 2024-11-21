const i18nMessages = {
    en: {
        audit: {
            name: 'Audit',
            title: 'Audit management',
            subtitle: 'View, search, create, edit and delete Audit',
            filters: "Audit filters",
            filterByUser: 'Realized by user',
            showing: 'Showing Audit',
            menu: 'Audit',
            labels: {
                user: 'User',
                action: 'Action',
                entity: 'Entity',
                createdAt: 'Date',
                details: 'Details',
                role: 'Role',
                changes: 'Changes'
            },

            userAudit: 'User audit',

            when: 'When',
            from: 'from',
            until: 'until',
            actionBy: 'Action By',
            actionFor: 'Action For',
            action: 'Action',

            actions: {
                create: 'Crear',
                read: 'Visualizar',
                update: 'Modificar',
                delete: 'Eliminar',
                
                detailMessages: {
                    create: 'A resource with ID "{resourceID}" was created',
                    read: 'A resource with ID "{resourceID}" was visualized',
                    update: 'A resource with ID "{resourceID}" was updated',
                    delete: 'A resource with ID "{resourceID}" was deleted',
                },

                changes: {
                    field: 'Campo',
                    oldValue: 'Valor anterior',
                    newValue: 'Valor nuevo',
                },
            },

            today: 'Today',
            yesterday: 'Yesterday',
            userRecoveryPasswordChange: 'user {username} has recovered his password',
            userPasswordChange: 'user {username} has modified his password',
            adminPasswordChange: 'user {username}\'s password was changed by administrator',
            userCreated: 'user {username} has been created',
            userModified: 'user {username} has been modified',
            userDeleted: 'user {username} has been deleted',
            userRestored: 'user {username} has been restored',
            passwordRecovery: 'user {username} has requested to recover password',
            userRegistered: 'user {username} has registered',
            userActivated: 'user {username} has activated his account',
            avatarChange: 'user {username} has modified his avatar',

            failedLogins: 'Failed logins',
            nofailedLogins: 'No failed logins ',
            auditFilterByUser: 'Filter by user'
        }    
    },
    es: {
        audit: {
            name: 'Auditorias',
            title: 'Visualizacion de Auditorias',
            subtitle: 'Ver y buscar Auditorias',
            filters: "Filtros de auditoria",
            filterByUser: 'Realizada por usuario',
            showing: 'Detalles de Auditoria',
            menu: 'Auditoria',
            labels: {
                user: 'Usuario',
                action: 'Acción',
                entity: 'Entidad',
                createdAt: 'Fecha',
                details: 'Detalles',
                role: 'Rol',
                changes: 'Cambios'
            },

            userAudit: 'Auditoria de usuario',
            when: 'Cuando',
            from: 'Desde',
            until: 'Hasta',
            actionBy: 'Acción Por',
            actionFor: 'Acción Para',
            action: 'Acción',

            actions: {
                create: 'Crear',
                read: 'Visualizar',
                update: 'Modificar',
                delete: 'Eliminar',
                
                detailMessages: {
                    create: 'Se ha creado un recurso con ID "{resourceID}"',
                    read: 'Se ha visualizado un recurso con ID "{resourceID}"',
                    update: 'Se ha modificado un recurso con ID "{resourceID}"',
                    delete: 'Se ha eliminado un recurso con ID "{resourceID}"',
                },

                changes: {
                    field: 'Campo',
                    oldValue: 'Valor anterior',
                    newValue: 'Valor nuevo',
                },
            },

            today: 'Hoy',
            yesterday: 'ayer',
            userRecoveryPasswordChange: 'usuario {username} ha recuperado su contraseña',
            userPasswordChange: 'usuario {username} ha modificado su contraseña',
            adminPasswordChange: 'la contraseña de {username} fue modificada por administrator',
            userCreated: 'usuario {username} ha sido creado',
            userModified: 'usuario {username} ha sido modificado',
            userDeleted: 'usuario {username} ha sido borrado',
            userRestored: 'usuario {username}  ha sido restaurado',
            passwordRecovery: 'usuario {username} ha solicitado recuperar su contraseña',
            userRegistered: 'usuario {username} se ha registrado',
            userActivated: 'usuario {username} ha activado su cuenta',
            avatarChange: 'usuario {username} ha modificado su avatar',

            failedLogins: 'Inicios de sesión fallidos',
            nofailedLogins: 'Sin inicios de sesión fallidos',
            auditFilterByUser: 'Filtrar por usuario'
        }
    },
    pt: {
        audit: {
            name: 'Audit',
            title: 'Administração de Audit',
            subtitle: 'Ver, buscar, criar, editar e usar Audit',
            filters: "filtros de audit",
            filterByUser: 'Realizada por usuario',
            showing: 'Detalhes do Audit',
            menu: 'Audit',
            labels: {
                user: 'Nome do usuário',
                action: 'Açao',
                entity: 'Entity',
                createdAt: 'Data',
                details: 'Details',
                role: 'Rol',
                changes: 'Changes'
            },

            userAudit: 'Auditoria de Usuário',
            when: 'Quando',
            from: 'Desde',
            until: 'Hasta',
            actionBy: 'Ação por',
            actionFor: 'Ação Para',
            action: 'Ação',

            actions: {
                create: 'Crear',
                read: 'Visualizar',
                update: 'Modificar',
                delete: 'Eliminar',
                
                detailMessages: {
                    create: 'Se ha creado un recurso con ID "{resourceID}"',
                    read: 'Se ha visualizado un recurso con ID "{resourceID}"',
                    update: 'Se ha modificado un recurso con ID "{resourceID}"',
                    delete: 'Se ha eliminado un recurso con ID "{resourceID}"',
                },

                changes: {
                    field: 'Campo',
                    oldValue: 'Valor anterior',
                    newValue: 'Valor nuevo',
                },
            },

            today: 'hoje',
            yesterday: 'ontem',
            userRecoveryPasswordChange: 'O usuário {username} recuperou sua senha',
            userPasswordChange: 'Usuário {username} mudou sua senha',
            adminPasswordChange: 'a senha de {username} foi alterada pelo administrador',
            userCreated: 'Usuário {username} foi criado',
            userModified: 'Usuário {username} foi modificado',
            userDeleted: 'Usuário {username}  foi excluído',
            userRestored: 'Usuário {username}  foi restaurado',
            passwordRecovery: 'Usuário {username} solicitou recuperar sua senha',
            userRegistered: 'Usuário {username}  se cadastrou',
            userActivated: 'Usuário {username} ativou sua conta',
            avatarChange: 'Usuário {username} mudou sua avatar',
            failedLogins: 'Logins com falha',
            nofailedLogins: 'Sem logins com falha',
            auditFilterByUser: 'Filtrar por usuario'
        }
    }
    
}

module.exports = {
    i18nMessages
}