<template>
    <crud-layout title="role.title" subtitle="role.description">

        <template v-slot:list>

            <loading v-if="loadingRoles || loadingPermissions"></loading>

            <role-list
                    v-else
                    :roles="roles"
                    :permissions="permissions"
                    @update="openUpdate"
                    @delete="openDelete"
                    @copy="openCopy"
            ></role-list>



        </template>

        <role-create v-if="creating"
                     :open="creating"
                     v-on:roleCreated="onRoleCreated"
                     v-on:close="creating=false"
                     :permissions="permissions"
        />

        <role-update v-if="!!roleToUpdate"
                     :open="!!roleToUpdate"
                     :role="roleToUpdate"
                     :permissions="permissions"
                     v-on:close="roleToUpdate=null"
                     v-on:roleUpdated="onRoleUpdated"
        />

        <role-copy v-if="!!roleToCopy"
                     :open="!!roleToCopy"
                     :role="roleToCopy"
                     :permissions="permissions"
                     v-on:close="roleToCopy=null"
                     v-on:roleCopied="onRoleCreated"
        />


        <role-delete v-if="!!roleToDelete"
                     :open="!!roleToDelete"
                     :role="roleToDelete"
                     v-on:roleDeleted="onRoleDeleted"
                     v-on:close="roleToDelete=null"
        />


        <add-button @click="creating = true"></add-button>

        <snackbar v-model="flashMessage"/>
    </crud-layout>
</template>

<script>
    import RoleCreate from "./RoleCreate/RoleCreate";
    import RoleCopy from "./RoleCopy/RoleCopy";
    import RoleDelete from "./RoleDelete/RoleDelete";
    import RoleUpdate from "./RoleUpdate/RoleUpdate";
    import RoleProvider from "../../providers/RoleProvider";
    import RoleList from "./RoleList";
    import Vue from "vue";
    import {CrudLayout, AddButton, Snackbar, Loading} from "@dracul/common-frontend"

    export default {
        name: "RoleCrud",
        components: {CrudLayout, Snackbar, Loading, AddButton, RoleList, RoleCreate, RoleDelete, RoleUpdate, RoleCopy},
        data() {
            return {
                loadingPermissions: true,
                loadingRoles: true,
                permissions: [],
                roles: [],
                roleToUpdate: null,
                roleToCopy: null,
                roleToDelete: null,
                creating: false,
                flashMessage: null
            }
        },
        created() {
            this.load()
        },
        methods: {
            load() {


                RoleProvider.permissions().then(r => {
                    this.permissions = r.data.permissions.permissions;
                }).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingPermissions = false)

                RoleProvider.roles().then(r => {
                    this.roles = r.data.roles;
                }).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingRoles = false)

            },
            openUpdate(role) {
                this.roleToUpdate = role
            },
            openCopy(role) {
                this.roleToCopy = role
            },
            openDelete(role) {
                this.roleToDelete = role
            },
            onRoleCreated(role) {
                this.roles.push(role);
                this.flashMessage = this.$t('role.created')
            },
            onRoleDeleted(role) {
                let index = this.roles.findIndex(i => i.id == role.id)
                this.roles.splice(index, 1)
                this.flashMessage = this.$t('role.deleted')
            },
            onRoleUpdated(role) {
                let index = this.roles.findIndex(i => i.id == role.id)
                Vue.set(this.roles, index, role)
                this.flashMessage = this.$t('role.updated')
            }
        }
    }
</script>

<style scoped>

</style>