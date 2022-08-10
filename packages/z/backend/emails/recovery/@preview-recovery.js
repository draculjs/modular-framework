require('dotenv').config();
const Email = require('email-templates');


//Preview: node emails/recovery/@preview-recovery.js

const email = new Email({
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "yo",
    },
    send: false,
    preview: true
});

email.send({
    template: 'recovery',
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "me",
    },
    locals: {
        appName: process.env.APP_NAME,
        name:  "Jhon Doe",
        url: "http://url_loca.com",
        username: "USERNAME",
        title: "Recuperacion de Contraseña",
        description: "Hemos recibido tu solicitud para recuperar tu contraseña, podras hacerlo desde el siguiente link:",
        btnText: "Recuperar Contraseña",
        copyright: "Copyright @ " + process.env.APP_NAME + " " +new Date().getFullYear()
    }
}).then(console.log)
    .catch(console.error);
