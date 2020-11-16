import NotificationShow from "./index";
import * as NotificationShowListStories from "../NotificationShowList/NotificationShowList.stories"
import i18n from "../../../i18n";

export default {
    title: "Pages/NotificationShow",
    component: NotificationShow,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { NotificationShow },
    template:
        '<notification-show/>',
    i18n

});

export const NotificationsShow = Template.bind({});
NotificationsShow.args = {
    ...NotificationShowListStories
};
