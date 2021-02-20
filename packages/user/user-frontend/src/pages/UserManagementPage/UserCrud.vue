<template>
  <crud-layout title="user.title" subtitle="user.description">

    <template v-slot:list>
      <user-list
          ref="list"
          @open-change-password="openChangePassword"
          @open-change-avatar="openChangeAvatar"
          @open-delete="openDelete"
          @open-edit="openEdit"
          @open-show="openShow"
          @open-apikey="openApikey"
      />
    </template>


    <user-create v-if="creating"
                 :open="creating"
                 v-on:close="creating=false"
                 @userCreated="onUserCreated"
    />

    <user-update v-if="updating"
                 :open="updating"
                 :user="userToEdit"
                 v-on:close="updating=false"
                 @userUpdated="onUserUpdated"
    />


    <user-delete v-if="deleting"
                 :open="deleting"
                 :user="userToDelete"
                 v-on:close="deleting=false"
                 @userDeleted="onUserDeleted"
    />


    <user-show v-if="showing"
               :open="showing"
               :item="userToShow"
               v-on:close="showing=false"
    />


    <user-change-password v-if="changePassword"
                          :open="changePassword"
                          :user="userToEdit"
                          v-on:close="changePassword=false"
                          @changePasswordConfirmed="changePasswordConfirmed"
    />

    <user-change-avatar v-if="changeAvatar"
                          :open="changeAvatar"
                          :user="userToEdit"
                          v-on:close="changeAvatar=false"
                          @changeAvatarConfirmed="changeAvatarConfirmed"
    />

    <user-apikey v-if="gettingApikey"
                 :open="gettingApikey"
                 :user="userToGetApikey"
                 v-on:close="gettingApikey = false"
    ></user-apikey>

    <snackbar v-model="flashMessage"/>

    <add-button v-if="canCreate" @click="openCreate"></add-button>

  </crud-layout>

</template>

<script>

import UserCreate from "./UserCreate"
import UserUpdate from './UserUpdate'
import UserChangePassword from './AdminChangePassword'
import UserChangeAvatar from './AdminChangeAvatar'
import UserDelete from "./UserDelete";
import UserShow from "./UserShow";
import UserList from "./UserList";
import {CrudLayout, AddButton, Snackbar} from "@dracul/common-frontend"
import UserApikey from "./UserApikey/UserApikey";
import {mapGetters} from "vuex";

export default {
  name: "UserCrud",
  components: {
    UserApikey,
    UserList,
    UserShow,
    UserDelete,
    UserCreate,
    UserUpdate,
    UserChangePassword,
    UserChangeAvatar,
    CrudLayout,
    AddButton,
    Snackbar
  },
  data() {
    return {
      flashMessage: null,
      dialog: false,
      creating: false,
      updating: false,
      deleting: false,
      changePassword: false,
      changeAvatar: false,
      gettingApikey: false,
      userToEdit: null,
      userToDelete: null,
      showing: false,
      userToShow: null,
      userToGetApikey: null
    }
  },
  computed: {
    ...mapGetters(['hasPermission']),
    canCreate() {
      return this.hasPermission('SECURITY_USER_CREATE')
    }
  },
  methods: {
    openCreate() {
      this.creating = true
      this.dialog = true
    },
    openEdit(user) {
      this.updating = true
      this.userToEdit = user
    },
    openShow(user) {
      this.showing = true
      this.userToShow = user
    },
    openDelete(user) {
      this.deleting = true
      this.userToDelete = user
    },
    openChangePassword(user) {
      this.changePassword = true
      this.userToEdit = user
    },
    openChangeAvatar(user) {
      this.changeAvatar = true
      this.userToEdit = user
    },
    openApikey(user) {
      this.gettingApikey = true
      this.userToGetApikey = user
    },
    onUserCreated() {
      this.$refs.list.fetch()
      this.flashMessage = this.$t('user.created')
    },
    onUserUpdated() {
      this.$refs.list.fetch()
      this.flashMessage = this.$t('user.updated')
    },
    onUserDeleted() {
      this.$refs.list.fetch()
      this.flashMessage = this.$t('user.deleted')
    },
    changePasswordConfirmed() {
      this.flashMessage = this.$t('user.passwordChanged')
    },
    changeAvatarConfirmed() {
      this.$refs.list.fetch()
      this.flashMessage = this.$t('user.avatarChanged')
    }
  },

}
</script>

