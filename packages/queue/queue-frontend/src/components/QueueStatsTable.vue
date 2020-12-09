<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
            <tr>
                <th class="text-left" v-t="'queue.stats.topic'"></th>
                <th class="text-left" v-t="'queue.stats.added'"></th>
                <th class="text-left" v-t="'queue.stats.pending'"></th>
                <th class="text-left" v-t="'queue.stats.gotten'"></th>
                <th class="text-left" v-t="'queue.stats.failed'"></th>
                <th class="text-left" v-t="'queue.stats.done'"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in queueStats" :key="item.name">
                <td>{{ item.topic }}</td>
                <td>{{ item.added }}</td>
                <td>{{ (item.added - item.done) }}</td>
                <td>{{ item.gotten }}</td>
                <td>{{ item.failed }}</td>
                <td>{{ item.done }}</td>
            </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
    export default {
        name: "QueueStatsTable",
        props: {
            queueStats: {type: Array, require: true}
        }
    }
</script>

<style scoped>

</style>
