import CuztomizationLogo from './CustomizationLogo';
import i18n from '../../../../i18n'

export default {
    title: 'Components/CuztomizationLogo',
    component: CuztomizationLogo,
    argTypes: {
        formLogo: { mode:"Square",
        title:"APP TITULO",
        url:"http://localhost:5000/media/logo/preview-eliminar.png?3ji" },
      },
}

const Template = (args, { argTypes }) => ({
    components: {CuztomizationLogo},
    props: Object.keys(argTypes),
    template: '<cuztomization-logo></cuztomization-logo>',
    i18n: i18n
  });

export const exampleCuztomizationLogoArgs = Template.bind({});
exampleCuztomizationLogoArgs.args = {
    
    formLogo: {
        mode:"Square",
        title:"APP TITULO",
        url:"http://localhost:5000/media/logo/preview-eliminar.png?3ji"
    }
};