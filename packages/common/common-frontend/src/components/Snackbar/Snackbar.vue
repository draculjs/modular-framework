<template>
    <v-snackbar
            v-model="snackbar"
            :color="color"
            :timeout="timeout"
            bottom
    >

        <v-btn dark text @click="snackbar = false">
            <v-icon>close</v-icon>
        </v-btn>

        {{getMessage}}
    </v-snackbar>
</template>

<script>

    export default {
        name: "Snackbar",
        props: {
            value: String,
            message: String,
            color: {type: String, default: "success"},
            timeout: {type: Number, default: 4000}
        },
        data() {
            return {
                snackbar: false,
            }
        },
        computed:{
            getMessage(){
                return this.value?this.value:this.message
            }
        },
        watch: {
            value: function (value) {
                if (value) {
                    this.snackbar = true
                }

            },
            message: function (value) {
                if (value) {
                    this.snackbar = true
                }

            },
            snackbar: function (value) {
                if (value === false) {
                    this.$emit('end')
                    this.$emit('input', null)
                }

            },
        }
    }
</script>

<style scoped>

</style>