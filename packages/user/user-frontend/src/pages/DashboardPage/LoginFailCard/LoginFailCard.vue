<template>

    <v-card height="100%">
        <v-card-title v-t="'user.audit.failedLogins'">Login Fails <span class="ml-2 subtitle-1"> (72 hs)</span></v-card-title>


        <v-card-text v-if="data.length > 0">
            <v-simple-table dense class="text-center">
                <template v-slot:default>
                    <thead>
                    <tr class="text-center">
                        <th class="text-center" v-t="'user.label.username'"></th>
                        <th class="text-center" v-t="'user.metrics.attempts'"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in data" :key="item.name">
                        <td>{{ item.username }}</td>
                        <td>{{ item.attempts }}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>

        <v-card-text v-else v-t="'user.audit.nofailedLogins'">
        </v-card-text>

    </v-card>
</template>
<script>


    export default {
        name: 'loginFailCard',
        props:{
          data: Array
        },
    }
</script>
