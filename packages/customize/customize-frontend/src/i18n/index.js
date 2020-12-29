import Vue from "vue";
import VueI18n from 'vue-i18n'
import merge from 'deepmerge'
import messages from './messages'
import errorMessages from './error-messages'
import {i18nMessages} from '@dracul/common-frontend'
Vue.use(VueI18n)

export default new VueI18n({
    locale: 'en',
    messages: merge.all([messages,i18nMessages, errorMessages]),
})
