<template>

    <v-avatar
            :tile="tile"
            :size="avatarSize"
            color="grey lighten-4"
            slot="activator"
            v-on:mouseover="hover = true"
            v-on:mouseleave="hover = false"

    >
        <img v-if="getAvatarUrl" :src="getAvatarUrl"
             style="position: absolute"
        />
        <img v-else
             style="position: absolute"
             :src="src"
        />

        <img v-if="getAvatarUrl"
             v-show="hover || loading"
             style="position: absolute"
             :src="getAvatarUrl"
        />

        <img v-else
             v-show="hover || loading"
             style="position: absolute"
             :src="src"
        />

        <v-progress-circular
                v-if="loading"
                :size="50"
                color="primary"
                indeterminate
        />

        <v-col v-else
               v-show="hover"
               style="position: relative; cursor:pointer;"
               class="grey--text"
        >
            <v-icon class="grey--text">photo_camera</v-icon>
            <br>
            <span class="font-weight-bold">Cambiar Foto</span>
        </v-col>
    </v-avatar>


</template>

<script>
import {mapGetters} from 'vuex'

    export default {
        name: "ProfileAvatarImg",
        props: {
            loading: {type: Boolean, default: Boolean}
        },
        data: () => ({
            avatarSize: 120,
            tile: false,
            hover: false,
            src: require("../../../assets/user.png")
        }),
        computed: {
          ...mapGetters(['getAvatarUrl']),
        }
    }
</script>

<style scoped>

</style>
