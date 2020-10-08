export default{
    computed: {
        requiredRule() {
            return [v => !!v || this.$t('user.validation.required')];
        },
        emailRules() {
            return [
                v => !!v || this.$t('user.validation.required'),
                v => /.+@.+/.test(v) || this.$t('user.validation.emailFormat')
            ]
        },
    }
}