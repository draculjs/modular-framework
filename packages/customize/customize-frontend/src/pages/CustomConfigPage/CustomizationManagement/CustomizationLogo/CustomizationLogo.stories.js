import CuztomizationLogo from './CustomizationLogo';
import i18n from '../../../../i18n'
import {vuetify} from "../../../../plugins/vuetify";

import mockGqlClient from "../../../../../gqlc-mock/gqlc-mock";
import customizationProvider from "../../../../providers/CustomizationProvider";
customizationProvider.setGqlc(mockGqlClient)

export default {
    title: 'Components/CuztomizationLogo',
    component: CuztomizationLogo,
}

const Template = (args, { argTypes }) => ({
    components: {CuztomizationLogo},
    props: Object.keys(argTypes),
    template: '<cuztomization-logo v-bind="$props" ></cuztomization-logo>',
    i18n,
    vuetify
  });

export const exampleCuztomizationLogoArgs = Template.bind({});
exampleCuztomizationLogoArgs.args = {

    formLogo: {
        mode: "Square",
        title: "APP TITULO",
        url:"http://localhost:5000/media/logo/preview-eliminar.png?3ji"
    }
};
