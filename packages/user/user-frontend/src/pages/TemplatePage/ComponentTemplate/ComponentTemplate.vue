<template>
    <div>
        <h3>Plantilla de componente</h3>
        {{data}}
        <p>otro texto agregado</p>
    </div>
</template>

<script>
    export default {
        name: "ComponentTemplate",
        props: {
            data: Array
        }
    }
</script>

<style scoped>

</style>