export default{
    computed: {
        required() {
            return [v => (!!v || v === 0) || this.$t('common.required')];
        },
    }
}
