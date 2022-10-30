import Vue from 'vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuetify, {
    VSimpleTable,
    VApp,
    VMain,
    VProgressLinear,
    VRow,
    VCol,
    VImg,
    VItemGroup,
    VTimePickerClock,
    VToolbar,
    VWindow,
    VTreeview,
    VDataFooter,
    VDivider,
    VCounter,
    VDataTable,
    VMenu,
    VBadge,
    VIcon,
    VTooltip,
    VBtn,
    VCardActions,
    VListItem,
    VSpacer,
    VList,
    VCardText,
    VCard,
    VListItemContent,
    VListItemTitle,
    VListItemAction,
    VPicker,
    VRadioGroup,
    VForm,
    VAlert,
    VCardTitle,
    VCardSubtitle,
    VSelect,
    VTextField,
    VAvatar,
    VToolbarTitle,

} from 'vuetify/lib';

import i18n from '../i18n'

Vue.use(Vuetify, {
    components: {
        VSimpleTable,
        VApp,
        VMain,
        VProgressLinear,
        VRow,
        VCol,
        VImg,
        VItemGroup,
        VTimePickerClock,
        VToolbar,
        VWindow,
        VTreeview,
        VDataFooter,
        VDivider,
        VCounter,
        VDataTable,
        VMenu,
        VBadge,
        VIcon,
        VTooltip,
        VBtn,
        VCardActions,
        VListItem,
        VSpacer,
        VList,
        VCardText,
        VCard,
        VListItemContent,
        VListItemTitle,
        VListItemAction,
        VPicker,
        VRadioGroup,
        VForm,
        VAlert,
        VCardTitle,
        VCardSubtitle,
        VSelect,
        VTextField,
        VAvatar,
        VToolbarTitle
    }
});

const LIGHT_THEME = {
    primary: '#3F51B5',
    onPrimary: '#FFFFFF',
    secondary: '#1565C0',
    onSecondary: '#FFFFFF',
    background: '#F5F5F5'
}

const DARK_THEME = {
    primary : "#71DDC7",
    onPrimary : "#000000",
    secondary : "#E57FFB",
    onSecondary : "#010101",
    background : "#121212"
}



const vuetify =  new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
    icons: {
        iconfont: 'md'
    },
    theme: {
        themes: {
            light: {
                background:  LIGHT_THEME.background,
                primary: LIGHT_THEME.primary,
                secondary: LIGHT_THEME.secondary,
                onPrimary: LIGHT_THEME.onPrimary,
                onSecondary: LIGHT_THEME.onSecondary
            },
            dark: {
                background:  DARK_THEME.background,
                primary: DARK_THEME.primary,
                secondary: DARK_THEME.secondary,
                onPrimary: DARK_THEME.onPrimary,
                onSecondary: DARK_THEME.onSecondary
            }
        }
    },
});

export { vuetify }
