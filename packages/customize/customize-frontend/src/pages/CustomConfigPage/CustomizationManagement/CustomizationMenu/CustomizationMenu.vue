<template>
    <v-card
            outlined
            class="mx-auto"
    >
        <v-card-title v-t="'customization.title'"></v-card-title>
        <v-list shaped>
            <v-list-item-group v-model="model">
                <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                        :disabled="i == value"
                >
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title >{{$t(item.text)}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>
<script>
    export default {
        name: 'CustomizationMenu',
        props: {
            value: {type: Number, default: 0}
        },
        computed: {
          model: {
              get(){
                  return this.value
              },
              set(val){
                  this.$emit('input',val)
              }
          }
        },
        data() {
            return {
                items: [
                    {
                        icon: 'mdi-translate',
                        text: 'customization.lang.title',
                    },
                    {
                        icon: 'mdi-palette',
                        text: 'customization.colors.title',
                    },
                    {
                        icon: 'mdi-star',
                        text: 'customization.logo.title',
                    },
                ]
            }
        }
    }
</script>
