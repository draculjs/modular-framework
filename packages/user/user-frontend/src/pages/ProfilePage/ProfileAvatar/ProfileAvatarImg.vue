<template>

    <v-avatar
            :tile="tile"
            :size="avatarSize"
            color="grey lighten-4"
            slot="activator"
            v-on:mouseover="hover = true"
            v-on:mouseleave="hover = false"

    >
        <img v-if="me && me.avatarurl" :src="getSrc"
             style="position: absolute"
        />
        <img v-else
             style="position: absolute"
             :src="src"
        />

        <img v-if="me && me.avatarurl"
             v-show="hover || loading"
             style="position: absolute"
             :src="me.avatarurl"
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
    import {mapState} from 'vuex'

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
            getSrc: function () {
                if (this.me && this.me.avatarurl) {
                    return this.me.avatarurl
                } else {
                    return this.src
                }
            },
            ...mapState({
                me: state => state.user.me,
            })
        }
    }
</script>

<style scoped>

</style>
