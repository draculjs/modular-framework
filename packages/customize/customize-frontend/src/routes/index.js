import CustomizationPage from '../pages/CustomConfigPage'

 const routes = [
    {
        name: "customization",
        path: '/customization',
        component: CustomizationPage,
        meta: {
            requiresAuth: true,
            permission: "CUSTOMIZATION_SHOW"
        }
    },

]

export default routes