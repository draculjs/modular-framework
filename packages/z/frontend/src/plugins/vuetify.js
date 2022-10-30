import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import i18n from '../i18n'
Vue.use(Vuetify);
import store from '../store'

const LIGHT_THEME = {
    primary: '#3F51B5',
    onPrimary: '#FFFFFF',
    secondary: '#1565C0',
    onSecondary: '#FFFFFF',
    background: '#F5F5F5',
    appBar: '#3F51B5',
    onAppBar: '#FFFFFF',
}

const DARK_THEME = {
    primary : "#71DDC7",
    onPrimary : "#000000",
    secondary : "#E57FFB",
    onSecondary : "#010101",
    background : "#121212",
    appBar: '#000000',
    onAppBar: '#71DDC7',
}


export default new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
    icons:{
        iconfont: 'md'
    },
    theme: {
        dark: store.getters.darkMode,
        themes: {
            light: {
                background:  LIGHT_THEME.background,
                appBar:  LIGHT_THEME.appBar,
                onAppBar:  LIGHT_THEME.onAppBar,
                primary: LIGHT_THEME.primary,
                secondary: LIGHT_THEME.secondary,
                onPrimary: LIGHT_THEME.onPrimary,
                onSecondary: LIGHT_THEME.onSecondary,
            },
            dark: {
                background:  DARK_THEME.background,
                appBar:  DARK_THEME.appBar,
                onAppBar:  DARK_THEME.onAppBar,
                primary: DARK_THEME.primary,
                secondary: DARK_THEME.secondary,
                onPrimary: DARK_THEME.onPrimary,
                onSecondary: DARK_THEME.onSecondary
            }
        }
    },
});
