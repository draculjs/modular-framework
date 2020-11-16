import NotificationButton from './NotificationButton.vue';

export default {
    title: 'Notifications/NotificationButton',
    component: NotificationButton
}

const Template = (args, {}) => ({
    components: {NotificationButton},
    template: '<notification-button></notification-button>'
})

export const WithoutNotifications = Template.bind({})
