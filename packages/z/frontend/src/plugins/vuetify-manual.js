import Vue from 'vue';
import Vuetify, {
    VApp, VForm, VTextField, VBtn, VSelect, VCheckbox, VSwitch,
    VCard, VCardText, VCardTitle, VCardActions, VCardSubtitle,
    VContent, VContainer, VRow, VCol, VSpacer,
    VToolbar, VToolbarItems, VToolbarTitle, VProgressLinear, VMenu, VProgressCircular,
    VAlert, VIcon, VTooltip, VDivider,
    VDialog, VDataTable, VAvatar, VSimpleTable,
    VColorPicker, VChip, VChipGroup, VSnackbar,
    VList, VListItem, VListGroup, VListItemIcon, VListItemAction, VListItemTitle, VListItemSubtitle, VListItemContent
} from 'vuetify/lib';
import i18n from '../i18n'

Vue.use(Vuetify, {
    components: {
        VApp,
        VForm,
        VTextField,
        VBtn,
        VSelect,
        VCheckbox,
        VSwitch,
        VCard,
        VCardText,
        VCardTitle,
        VCardActions,
        VCardSubtitle,
        VContent,
        VContainer,
        VRow,
        VCol,
        VSpacer,
        VToolbar,
        VToolbarItems,
        VToolbarTitle,
        VProgressLinear,
        VMenu,
        VProgressCircular,
        VAlert,
        VIcon,
        VTooltip,
        VDivider,
        VDialog,
        VDataTable,
        VAvatar,
        VSimpleTable,
        VColorPicker,
        VChip,
        VChipGroup,
        VSnackbar,
        VList,
        VListItem,
        VListGroup,
        VListItemIcon,
        VListItemAction,
        VListItemTitle,
        VListItemSubtitle,
        VListItemContent
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
