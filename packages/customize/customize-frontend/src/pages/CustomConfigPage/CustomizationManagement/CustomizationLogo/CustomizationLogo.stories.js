import CuztomizationLogo from './CustomizationLogo';
import i18n from '../../../../i18n'

export default {
    title: 'Components/CuztomizationLogo',
    component: CuztomizationLogo
}

const Template = (args, {}) => ({
    components: {CuztomizationLogo},
    template: '<cuztomization-logo></cuztomization-logo>',
    i18n: i18n
})

export const exampleCuztomizationLogo = Template.bind({})