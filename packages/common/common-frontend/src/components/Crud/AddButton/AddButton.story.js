import AddButton from "./AddButton"
import i18n from "../../../i18n"


const decorator = () => `<story/>`

export default {
    title: "Components|AddButton",
};


const data = []

export const normal = () => ({
    components: {AddButton},
    props: {
        data: {default: data}
    },
    template: '<AddButton :data="data" />',
    i18n
})
