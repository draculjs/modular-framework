<template>
        <password-success v-if="success" @close="$emit('closeDialog')"/>
        <password-form v-else @success="success=true" @close="$emit('closeDialog')"/>
</template>

<script>
    import PasswordForm from './ProfilePasswordForm'
    import PasswordSuccess from './ProfilePasswordSuccess'

    export default {
        name: "ProfilePassword",
        components: {
            PasswordForm,
            PasswordSuccess
        },
        data(){
            return {
                success: false
            }
        }
    }
</script>

<style scoped>

</style>
