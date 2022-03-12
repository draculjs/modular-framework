<template>
  <v-footer dark padless>
    <v-card
        flat
        tile
        class="text-center"
        min-width="100%"
        height="60px"
    >
      <div style="position: absolute; top:0%; right: 3%">
        <dark-mode></dark-mode>
      </div>
      <v-card-text>
        {{ new Date().getFullYear() }} <strong>@PerfilIT</strong>
      </v-card-text>

    </v-card>
  </v-footer>
</template>

<script>
import DarkMode from "@/layout/components/DarkMode";

export default {
  name: "Footer",
  components: {DarkMode}
}
</script>

<style scoped>

</style>
