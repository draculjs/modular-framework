require('dotenv').config();
const Email = require('email-templates');


//Preview: node emails/demo/@preview-demo.js

const email = new Email({
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "yo",
    },
    send: false,
    preview: true
});

email.send({
    template: 'demo',
    message: {
        from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
        to: "me",
    },
    locals: {
        appName: process.env.APP_NAME,
        name:  "Nombre Usuario",
        url: "http://url_loca.com",
        username: "USERNAME",
        title: "Su Titulo",
        description: "Su descripcion:",
        btnText: "Texto del Boton",
        signature: "Equipo de demo" ,
        copyright: "Copyright @ " + process.env.APP_NAME + " " +new Date().getFullYear()
    }
}).then(console.log)
    .catch(console.error);
