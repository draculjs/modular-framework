import notificationPage from "./index";

export default {
  title: "Pages/NotificationPage",
  component: notificationPage,
};

const Template = (args, { argTypes }) => ({

    props: Object.keys(argTypes),
    components: { notificationPage },
    template:
    '<notification-page/>'

});

export const Main = Template.bind({});
Main.args = {};
