import LogoPreview from './LogoPreview';
import i18n from '../../i18n'

export default {
    title: 'Components/LogoPreview',
    component: LogoPreview,
    argTypes: {
        mode:"Square",
        title:"APP TITULO",
        src:"http://localhost:5000/media/logo/preview-eliminar.png?3ji"
    }
}

const Template = (args, { argTypes}) => ({
    components: {LogoPreview},
    props: Object.keys(argTypes),
    template: '<logo-preview></logo-preview>',
    i18n: i18n
  });

export const logoPreviewProps = Template.bind({});
logoPreviewProps.args = {
        mode:"Square",
        title:"APP TITULO",
        src:"http://localhost:5000/media/logo/preview-eliminar.png?3ji"
};
