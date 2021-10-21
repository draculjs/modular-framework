import Vue from "vue";
import VueI18n from 'vue-i18n'
import merge from 'deepmerge'

import baseMessages from '../modules/base/i18n/messages'
import mediaMessages from '../modules/media/i18n/messages'
import permissionMessages from './messages'
import { i18nMessages as i18nMessagesCommon } from '@dracul/common-frontend'
import { i18nMessages as i18nMessagesUser } from '@dracul/user-frontend'
import { i18nMessages as i18nMessagesCustom } from '@dracul/customize-frontend'

const messages = merge.all([
    baseMessages,
    mediaMessages,
    i18nMessagesCommon,
    i18nMessagesUser,
    i18nMessagesCustom,
    permissionMessages,
])

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'en',
    messages,
})

export default i18n