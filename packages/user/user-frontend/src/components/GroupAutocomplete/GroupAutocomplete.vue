<template>
  <v-autocomplete
      v-model="groupValue"
      :items="groups"
      :filled="filled"
      :solo="solo"
      :chips="chips"
      :color="color"
      :background-color="backgroundColor"
      :label="$t(label)"
      :placeholder="$t(placeholder)"
      :item-text="'name'"
      :item-value="'id'"
      :multiple="multiple"
      :loading="loading"
      :clearable="clearable"
  >
    <template v-slot:selection="data">
      <v-chip
          v-if="chips"
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="remove(data.item.id)"
      >
        <v-avatar left :color="data.item.color?data.item.color:'grey'">
          <h4 class="white--text h4">{{ getAvatar(data.item) }}</h4>
        </v-avatar>
        {{ data.item.name }}
      </v-chip>
      <v-list-item v-else>
        <v-list-item-avatar>
          <v-avatar size="36px" :color="data.item.color?data.item.color:'grey'">
            <h3 class="white--text h3">{{ getAvatar(data.item) }}</h3>
          </v-avatar>

        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <v-avatar size="36px" :color="data.item.color?data.item.color:'grey'">
            <h3 class="white--text h3">{{ getAvatar(data.item) }}</h3>
          </v-avatar>

        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>

</template>

<script>
import GroupProvider from "../../providers/GroupProvider";

export default {
  name: "GroupAutocomplete",
  props: {
    value: {
      type: [String, Array]
    },
    filled: {type: Boolean, default: false},
    solo: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    chips: {type: Boolean, default: false},
    color: {type:String,default:"blue-grey lighten-2"},
    clearable: {type: Boolean, default: false},
    backgroundColor: {type:String},
    label: {type:String,default: 'group.groups'},
    placeholder: {type:String,default: 'group.groups'},
  },
  data() {
    return {
      groups: [],
      loading: false
    }
  },
  computed: {
    getAvatar() {
      return item => {
        if (item.name.length >= 2) {
          return item.name.charAt(0) + item.name.charAt(1)
        } else if (item.name.length >= 1) {
          return item.name.charAt(0)
        } else {
          return ""
        }
      }

    },
    groupValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)

      }
    }
  },
  mounted() {
    this.loadGroups()
  },
  methods: {
    remove(id) {
      if(this.multiple){
        const index = this.groupValue.indexOf(id)
        if (index >= 0){
          let aux = [...this.groupValue]
          aux.splice(index, 1)
          this.groupValue = aux
        }
      }else{
        this.groupValue = null
      }

    },
    loadGroups() {
      this.loading = true
      GroupProvider.groups().then(r => {
            this.groups = r.data.groups
          }
      ).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>
