require('dotenv').config();
const Email = require('email-templates');


//Preview: node emails/codeRecovery/@preview-recovery.js

const email = new Email({
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "yo",
    },
    send: false,
    preview: true
});

email.send({
    template: 'codeRecovery',
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "me",
    },
    locals: {
        appName: process.env.APP_NAME,
        name:  "Jhon Doe",
        url: "",
        username: "USERNAME",
        title: "Recuperacion de Contraseña",
        description: "Hemos recibido tu solicitud para recuperar tu contraseña, podras hacerlo con el siguiente codigo:",
        btnText: 1234,
        copyright: "Copyright @ " + process.env.APP_NAME + " " +new Date().getFullYear()
    }
}).then(console.log)
    .catch(console.error);
