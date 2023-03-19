<template>
  <v-container fill-height>
    <h1>TEST PAGE</h1>

    <v-card>
      <v-card-text>
        <form-list :value="list" :new-item="{name:'', age:1}" :min-length="1" :max-length="3">
          <template v-slot:default="{item,index}">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="list[index].name" label="name"></v-text-field>

              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="list[index].age" label="age"></v-text-field>

              </v-col>
            </v-row>
          </template>
        </form-list>
      </v-card-text>

    </v-card>

  </v-container>
</template>

<script>
import menuConfig from "@/menu-config/menu-config"
import {FormList} from "@dracul/common-frontend"

export default {
  name: 'TestPage',
  components:{FormList},
  data(){
    return {
      list: []
    }
  },
  computed: {
    menu() {
      return menuConfig
    }
  }
}
</script>

<style scoped>

</style>
