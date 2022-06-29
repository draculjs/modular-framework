<template>
  <v-container fluid>
    <v-row>
      <template v-for="(item) in nav">

        <v-col cols="12"
               v-if="item.children && isGranted(item) && !item.galleryHide"
               :key="item.text"
               :value="isActive(item)"
        >

          <h4 class="text-h4">
            {{ $te(item.text) ? $t(item.text) : item.text }}
          </h4>
          <v-divider class="mb-3"></v-divider>

          <v-row>
            <v-col cols="12" sm="4" md="4"
                   v-for="child in childActives(item.children)"
                   :key="child.text"
            >
              <menu-card
                  :title="$te(child.text) ? $t(child.text) : child.text"
                  :icon="child.icon"
                  :to="child.link"
              ></menu-card>
            </v-col>
          </v-row>

        </v-col>


        <v-col cols="12" sm="4" md="4"
               v-else-if="isGranted(item) && !item.galleryHide"
               :key="item.text"
        >
          <menu-card
              :title="$te(item.text) ? $t(item.text) : item.text"
              :icon="item.icon"
              :to="item.link"
          ></menu-card>
        </v-col>

      </template>
    </v-row>

  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import MenuCard from '../components/MenuCard'

export default {
  name: "GalleryMenu",
  components: {MenuCard},
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
    childActives() {
      return items => {
        return items.filter(item => this.isGranted(item))
      }
    },
    isActive() {
      return item => {
        if (item.children) {
          return item.children.some(i => {
            if (i.link && i.link.name) {
              return i.link.name === this.$route.name
            }
            return false
          })
        } else if (item.link && item.link.name) {
          return item.link.name === this.$route.name
        }

      }
    }
  },

}
</script>

<style scoped>

</style>
