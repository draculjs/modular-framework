<template>
    <div>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                <tr>
                    <th class="text-left">Topic</th>
                    <th class="text-left">Added</th>
                    <th class="text-left">Pending</th>
                    <th class="text-left">Gotten</th>
                    <th class="text-left">Failed</th>
                    <th class="text-left">Done</th>
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
        <loading v-if="loading"></loading>
    </div>

</template>

<script>
    import queueStatsProvider from "../../providers/QueueStatsProvider";
    import {Loading} from "@dracul/common-frontend"

    export default {
        name: "QueueStatsPage",
        components: {Loading},
        data() {
            return {
                loading: false,
                queueStats: null
            }
        },
        mounted() {
            this.fetchQueueStats()
        },
        methods: {
            fetchQueueStats() {
                this.loading = true
                queueStatsProvider.queueStats().then(response => {
                    this.queueStats = response.data.queueStats
                }).catch(err => {
                    console.error(err)
                }).finally(() => this.loading = false)
            }
        }
    }
</script>

<style scoped>

</style>
