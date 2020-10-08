<template>
    <sloty>
        Learn Slot

        <div>
            {{}}
        </div>

        <template v-slot:header="header">
            Titulo: {{header.title}}
        </template>

        <template v-slot:content="content">
            Description: {{content.description}}
        </template>

        <template v-slot:footer>
            My Footer
        </template>
    </sloty>
</template>

<script>
    import Sloty from "./Sloty";
    export default {
        name: "LearnSlot",
        components: {Sloty}
    }
</script>

<style scoped>

</style>