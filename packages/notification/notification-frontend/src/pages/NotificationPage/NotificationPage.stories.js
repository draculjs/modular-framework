import NotificationPage from "./index";
import i18n from "../../i18n";

export default {
  title: "Pages/NotificationPage",
  component: NotificationPage,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { NotificationPage },
    template:
    '<notification-page/>',
    i18n

});

export const Main = Template.bind({});

