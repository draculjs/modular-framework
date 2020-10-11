<template>
    <v-list dense class="pt-3">
        <template v-for="item in nav">

            <v-list-group
                    v-if="item.children && isGranted(item)"
                    :key="item.text"
            >

                <v-list-item slot="activator">
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item
                        v-for="child in item.children"
                        :key="child.text"
                        :to="child.link"
                        @click="$emit('closeDrawer')"
                >
                    <v-list-item-action v-if="child.icon">
                        <v-icon>{{ child.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ child.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>


            <v-list-item v-else-if="isGranted(item)" :key="item.text" :to="item.link" exact
                         @click="$emit('closeDrawer')">
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.text }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>
    </v-list>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "SidebarMenu",
        props: {
            nav: {type: Array, default: null},
        },
        methods: {
            isGranted: function (item) {


                if (item.role && item.permission) {
                    if(this.isAuth && item.role == this.me.role.name && this.me.role.permissions.includes(item.permission)){
                        return true
                    }
                    return false
                }


                if (item.role) {
                    if(this.isAuth && item.role == this.me.role.name){
                        return true
                    }
                    return false
                }

                if (item.permission) {
                    if(this.isAuth && this.me.role.permissions.includes(item.permission)){
                        return true
                    }
                    return false
                }

                return true
            },
        },
        computed: {
            ...mapGetters([
                'isAuth',
                'me'
            ]),
        },

    }
</script>

<style scoped>

</style>
