import {storiesOf} from '@storybook/vue';

//Activation
import Activation from '../src/pages/ActivationPage/Activation';
import ActivationError from '../src/pages/ActivationPage/ActivationError';
import ActivationInProgress from '../src/pages/ActivationPage/ActivationInProgress';
import ActivationSuccessful from '../src/pages/ActivationPage/ActivationSuccessful';



import store from '../src/store'
import i18n from '../src/i18n'
import router from '../src/router'

storiesOf('PageComponents/Activation', module)
    .add('Activation',
        () => ({
            components: {Activation},
            template: '<activation ></activation>',
            i18n, store, router
        }))
    .add('ActivationError',
        () => ({
            components: {ActivationError},
            template: '<activation-error ></activation-error>',
            i18n, store, router
        }))
    .add('ActivationInProgress',
        () => ({
            components: {ActivationInProgress},
            template: '<activation-in-progress ></activation-in-progress>',
            i18n, store, router
        }))
    .add('ActivationSuccessful',
        () => ({
            components: {ActivationSuccessful},
            template: '<activation-successful ></activation-successful>',
            i18n, store, router
        }))