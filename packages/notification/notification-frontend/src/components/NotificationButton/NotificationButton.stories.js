import NotificationButton from './NotificationButton.vue';

export default {
    title: 'Components/NotificationButton',
    component: NotificationButton
}

const Template = (args, {}) => ({
    components: {NotificationButton},
    template: '<notification-button></notification-button>'
})

export const WithNotifications = Template.bind({})
