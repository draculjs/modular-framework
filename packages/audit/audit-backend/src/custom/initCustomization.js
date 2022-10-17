import winston from "winston";
import {findCustomization,createCustomization} from '@dracul/customize-backend'

export const initCustomization = async function () {

    let customDoc = await findCustomization()

    if (!customDoc) {
        let customDoc = await createCustomization({
            colors: {
                primary: '#000000',
                onPrimary: '#FFFFFF',
                secondary: '#1565C0',
                onSecondary: '#FFFFFF'
            },
            logo: {
                mode: 'OnlyTitle',
                title: 'INCATAINER',
                filename: 'logo.png',
                url: process.env.APP_API_URL + '/media/logo/logo.png'
            },
            language: 'es'
        })
        winston.info("Customization created: " + customDoc.id)
    } else {
        winston.debug("Customization found: " + customDoc.id)
    }

}
