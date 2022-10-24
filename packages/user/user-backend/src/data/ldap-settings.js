export const LDAP_SETTINGS = [
    {
        key: 'LDAP_AUTH',
        type: 'boolean',
        value: false,
        label: {en: 'LDAP AUTH', es: 'LDAP AUTH', pt: 'LDAP AUTH'},
        reject: 'none'
    },
    {
        key: 'LDAP_DEFAULT_ROLE',
        type: 'string',
        value: '',
        label: {en: 'LDAP DEFAULT ROLE', es: 'LDAP DEFAULT ROLE', pt: 'LDAP DEFAULT ROLE'},
        reject: 'none'
    },
    {
        key: 'LDAP_DN',
        type: 'string',
        value: '',
        label: {en: 'LDAP DN', es: 'LDAP DN', pt: 'LDAP DN'},
        reject: 'none'
    },
    {
        key: 'LDAP_OU',
        type: 'string',
        value: '',
        label: {en: 'LDAP OU', es: 'LDAP OU', pt: 'LDAP OU'},
        reject: 'none'
    },
    {
        key: 'LDAP_IP',
        type: 'string',
        value: '',
        label: {en: 'LDAP IP', es: 'LDAP IP', pt: 'LDAP IP'},
        reject: 'no-ip'
    }
]
