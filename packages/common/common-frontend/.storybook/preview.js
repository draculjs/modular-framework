import { addDecorator, addParameters } from '@storybook/vue';
import vuetify from "../src/plugins/vuetify-manual";


addDecorator(() => ({
    vuetify,
    template: '<v-app><v-main><story/></v-main></v-app>',
}));


import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
    docs: {
        container: DocsContainer,
        page: DocsPage,
    },
});

