export default {
    computed: {
        getPermissionsTranslation() {
            return (permission) => {
                if (this.$te('role.permissions.' + permission)) {
                    return this.$t('role.permissions.' + permission)
                } else {
                    return permission
                }
            }
        }
    }
}