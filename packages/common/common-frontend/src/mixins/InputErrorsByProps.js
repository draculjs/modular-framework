export default {
    props: {
        inputErrors: {type: Object, default: () => { return {} } }
    },
    computed: {
        hasInputErrors() {
            return field => this.inputErrors[field] != undefined
        },
        getInputErrors() {
            return field => {
                if (this.inputErrors[field] != undefined) {
                    return this.inputErrors[field].map(i => this.$t(i))
                }
                return []
            }
        }
    }
}