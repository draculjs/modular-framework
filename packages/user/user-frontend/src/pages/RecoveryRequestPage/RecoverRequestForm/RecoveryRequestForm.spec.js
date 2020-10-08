import {mount, createLocalVue} from '@vue/test-utils'

export const localVue = createLocalVue()

import i18n from "../../../i18n"
import vuetify from "../../../plugins/vuetify-manual"

import RecoveryRequestForm from "./RecoveryRequestForm";
import {SubmitButton} from '@dracul/common-frontend'

describe('StartRecoveryForm', () => {

    it('Render Title',   ()=> {

        const wrapper = mount(RecoveryRequestForm, {
            vuetify,
            localVue,
            i18n
        })
        let stringExpected = i18n.t('auth.passwordRecovery')

        expect(wrapper.text()).toMatch(stringExpected)

    })

    it('Is there a submit button and is disable',   ()=> {

        const wrapper = mount(RecoveryRequestForm, {
            vuetify,
            localVue,
            i18n
        })

        let submitBtn = wrapper.findComponent(SubmitButton)


        expect(submitBtn).toBe(true);
        expect(submitBtn.vm.disabled).toBe(true);

    })

    it('Is loading off',   ()=> {

        const wrapper = mount(RecoveryRequestForm, {
            vuetify,
            localVue,
            i18n
        })

        let myComponent = wrapper.findComponent(RecoveryRequestForm)


        expect(myComponent.vm.loading).toBe(false)

    })


    it('Enter an invalid email format',   async ()=> {

        const wrapper = mount(RecoveryRequestForm, {
            vuetify,
            localVue,
            i18n
        })

        wrapper.find('[name="email"]').setValue('invalidEmail')
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect( wrapper.text()).toMatch('The email has an invalid format')

    })
})