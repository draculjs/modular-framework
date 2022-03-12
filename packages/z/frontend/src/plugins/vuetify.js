import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import i18n from '../i18n'
Vue.use(Vuetify);

let colors = {
    primary: '#3F51B5',
    onPrimary: '#FFFFFF',
    secondary: '#1565C0',
    onSecondary: '#FFFFFF'
}


export default new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
    icons:{
        iconfont: 'md'
    },
    theme: {
        themes: {
            light: {
                background: "#F5F5F5",
                primary: colors.primary,
                secondary: colors.secondary,
                onPrimary: colors.onPrimary,
                onSecondary: colors.onSecondary
            },
            dark: {
                background: "#424242",
                primary: colors.primary,
                secondary: colors.secondary,
                onPrimary: colors.onPrimary,
                onSecondary: colors.onSecondary
            }
        }
    },
});
