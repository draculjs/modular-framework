export default{
    computed: {
        required() {
            return [v => !!v || this.$t('common.required')];
        },
    }
}