<template>
    <v-row justify="center" align-content="center">
      <v-col cols="12" md="4" lg="4">
        <v-card class="pa-6" :style="{backgroundColor: background}">
          <v-card-title class="mb-3 justify-center" :style="{color: primary}">
            <div v-t="'customization.preview'"></div>
          </v-card-title>
          <v-card-text class="text-center">
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
      </v-col>
    </v-row>
</template>
<script>
export default {
  name: 'colors-preview',
  props: {
    background: {type: String},
    primary: {type: String},
    onPrimary: {type: String},
    secondary: {type: String},
    onSecondary: {type: String},
  }
}
</script>
