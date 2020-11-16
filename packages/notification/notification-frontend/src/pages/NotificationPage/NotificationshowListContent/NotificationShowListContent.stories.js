import NotificationShowListContent from './NotificationShowListContent.vue';
import i18n from "../../../i18n";

export default {
    title: 'Pages/NotificationShowListContent',
    component: NotificationShowListContent,
    argTypes: {
        item: [
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
    components: { NotificationShowListContent },
    template: '<notification-show-list-content v-bind="$props" :item="item"/>',
    i18n
});

const data = {
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

export const ItemExample = Template.bind({});

ItemExample.args = [{item: data}]
