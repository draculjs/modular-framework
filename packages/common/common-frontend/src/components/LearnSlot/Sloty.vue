<template>
    <div>
        <h3>PreDefault</h3>
        <slot>Default Slot</slot>

        <h3>PreHeader</h3>
        <slot name="header" v-bind:title="title">
            {{ title }}
        </slot>

        <h3>PreContent</h3>
        <slot name="content" v-bind:description="description">
            {{description}}
        </slot>

        <h3>PreFooter</h3>
        <slot name="footer" >Default Footer</slot>

    </div>
</template>

<script>
    export default {
        name: "Sloty",
        props: {
            title: {type:String, default:'Default Title'}
        },
        data(){
            return {
                description: 'Default Description'
            }
        }
    }
</script>

<style scoped>

</style>