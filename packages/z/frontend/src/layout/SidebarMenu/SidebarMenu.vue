<template>
  <v-list dense class="pt-3">
    <template v-for="(item) in nav">

      <v-list-group
          v-if="item.children && isGranted(item)"
          :key="item.text"
          :value="isActive(item)"
      >

        <v-list-item slot="activator">
          <v-list-item-content>
            <v-list-item-title>
              {{ $t(item.text) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
            v-for="child in childActives(item.children)"
            :key="child.text"
            :to="child.link"
            @click="$emit('closeDrawer')"
        >
          <v-list-item-action v-if="child.icon">
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t(child.text) }}
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
            {{ $t(item.text) }}
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
        if (this.isAuth && this.me && item.role == this.me.role.name && this.me.role.permissions.includes(item.permission)) {
          return true
        }
        return false
      }
      if (item.role) {
        if (this.isAuth && this.me && this.me.role && item.role == this.me.role.name) {
          return true
        }
        return false
      }
      if (item.permission) {
        if (this.isAuth && this.me && this.me.role && this.me.role.permissions && this.me.role.permissions.includes(item.permission)) {
          return true
        }
        return false
      }

      if (item.auth && !this.isAuth) {
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
    childActives(){
      return items => {
        return items.filter(item => this.isGranted(item))
      }
    },
    isActive(){
      return item => {
        if(item.children){
          return item.children.some(i => {
            if(i.link && i.link.name){
              return i.link.name === this.$route.name
            }
            return false
          })
        }else if(item.link && item.link.name){
          return item.link.name === this.$route.name
        }

      }
    }
  },

}
</script>

<style scoped>

</style>
