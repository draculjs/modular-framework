require('dotenv').config();
const Email = require('email-templates');

//Preview: node emails/activation/@preview-activation.js

const email = new Email({
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "yo",
    },
    send: false,
    preview: true
});

email.send({
    template: 'activation',
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "me",
    },
    locals: {
        appName: process.env.APP_NAME,
        name:  "Jhon Doe",
        url:  "http://url_loca.com",
        username: "USERNAME",
        title: "Activación de cuenta",
        description: "Hemos recibido tu solicitud de registro, para terminar de activar tu cuenta, accede al siguiente link:",
        btnText: "Activar cuenta",
        signature: "Equipo de activaciones" ,
        copyright: "Copyright @ " + process.env.APP_NAME + " " +new Date().getFullYear()
    }
}).then(console.log)
    .catch(console.error);
