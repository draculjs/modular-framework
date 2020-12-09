import NotificationShowList from './NotificationShowList.vue';
import * as NotificationShowListContentStories from '../NotificationshowListContent/NotificationShowListContent.stories'
import i18n from "../../../i18n";

export default {
    title: 'Pages/NotificationShowList',
    component: NotificationShowList,
    argTypes: {
        items: [
            {
                id:"5fa2e09c31fb4800105d3fa9",
                title:"Titulo de ejemplo",
                content:"Contenido de ejemplo",
                read:false,
                creationDate:"1604509852455",
                type:"ImportCSV",
                icon:"publish",
                readDate:null,
                __typename:"Notification"
            }
        ],
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { NotificationShowList },
    template: '<notification-show-list v-bind="$props"/>',
    i18n
});

export const WithNotifications = Template.bind({});

WithNotifications.args = {
    items: [
        {
            id:"5fa2e09c31fb4800105d3fa9",
            title:"Titulo de ejemplo",
            content:"Contenido de ejemplo",
            read:false,
            creationDate:"1604509852455",
            type:"ImportCSV",
            icon:"publish",
            readDate:null,
            __typename:"Notification"
        }
    ],
    ...NotificationShowListContentStories
};

export const WithoutNotifications = Template.bind({});
WithoutNotifications.args = {
    items: [],
};