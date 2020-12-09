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
    VListItemAction
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
        VListItemAction
    }
});

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
    icons: {
        iconfont: 'md'
    },
    theme: {
        themes: {
            light: {
                primary: colors.primary,
                secondary: colors.secondary,
                onPrimary: colors.onPrimary,
                onSecondary: colors.onSecondary
            }
        }
    },
});
