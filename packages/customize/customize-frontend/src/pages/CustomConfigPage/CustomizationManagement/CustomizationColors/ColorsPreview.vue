<template>
        <v-card class="pa-3" :style="{backgroundColor: background}">
          <v-card-title class="mb-3 justify-center" :style="{background: appBar, color: onAppBar}">
            <div v-t="'customization.preview'"></div>
          </v-card-title>
          <v-card-text class="text-center px-3">
            <v-row>
              <v-col cols="6" :style="{backgroundColor: primary, color: onPrimary}">
                {{ $t('customization.colors.primary') }}
              </v-col>
              <v-col cols="6" :style="{backgroundColor: secondary, color: onSecondary}">
                {{ $t('customization.colors.secondary') }}
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
</template>
<script>
export default {
  name: 'colors-preview',
  props: {
    background: {type: String},
    appBar: {type: String},
    onAppBar: {type: String},
    primary: {type: String},
    onPrimary: {type: String},
    secondary: {type: String},
    onSecondary: {type: String},
  }
}
</script>
