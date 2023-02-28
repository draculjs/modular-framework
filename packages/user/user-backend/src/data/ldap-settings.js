export const LDAP_SETTINGS = [
    {
        key: 'LDAP_AUTH',
        type: 'boolean',
        value: false,
        group: 'LDAP',
        label: {en: 'LDAP AUTH', es: 'LDAP AUTH', pt: 'LDAP AUTH'}
    },
    {
        key: 'LDAP_DEFAULT_ROLE',
        group: 'LDAP',
        type: 'dynamic',
        value: '',
        label: {en: 'LDAP DEFAULT ROLE', es: 'LDAP DEFAULT ROLE', pt: 'LDAP DEFAULT ROLE'},
        entity: 'roles',
        entityText: 'name',
        entityValue: 'name'
    },
    {
        key: 'LDAP_DN',
        type: 'string',
        value: '',
        group: 'LDAP',
        label: {en: 'LDAP DN', es: 'LDAP DN', pt: 'LDAP DN'}
    },
    {
        key: 'LDAP_OU',
        type: 'string',
        value: '',
        group: 'LDAP',
        label: {en: 'LDAP OU', es: 'LDAP OU', pt: 'LDAP OU'}
    },
    {
        key: 'LDAP_IP',
        type: 'string',
        value: '',
        group: 'LDAP',
        label: {en: 'LDAP IP', es: 'LDAP IP', pt: 'LDAP IP'},
        regex: '^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$'
    }
]
