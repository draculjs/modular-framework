<template>

    <v-toolbar

            color="primary"
            dark
    >
        <template v-if="mode === LOGO_MODE_SQUARE">
            <v-avatar tile size="50" color="grey lighten-2">
                <img v-if="src" :src="src"/>
                <img v-else src="../../assets/logo.png"/>
            </v-avatar>
        </template>

        <template v-else-if="mode === LOGO_MODE_ROUND">
            <v-avatar size="50" color="grey lighten-2">
                <img v-if="src" :src="src"/>
                <img v-else src="../../assets/logo.png"/>
            </v-avatar>
        </template>

        <template v-else-if="mode === LOGO_MODE_RECTANGLE" class="grey lighten-2">
            <v-img v-if="src" height="50" max-width="150" contain :src="src"/>
            <v-img v-else height="50" contain src="../../assets/logo.png"/>
        </template>
        <v-toolbar-title class="onPrimary--text ml-2">
            {{title}}
        </v-toolbar-title>
    </v-toolbar>
</template>
<script>
    import {LOGO_MODE_SQUARE, LOGO_MODE_ROUND, LOGO_MODE_RECTANGLE} from '../../constants'

    export default {
        name: 'LogoPreview',
        props: {
            src: String,
            mode: String,
            title: String
        },
        created() {
            this.LOGO_MODE_SQUARE = LOGO_MODE_SQUARE
            this.LOGO_MODE_ROUND = LOGO_MODE_ROUND
            this.LOGO_MODE_RECTANGLE = LOGO_MODE_RECTANGLE
        }
    }
</script>
