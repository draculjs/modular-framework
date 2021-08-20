require('dotenv').config()
import {DefaultLogger as winston} from '@dracul/logger-backend';
import nodemailer from "nodemailer"

import Email from 'email-templates';

class UserEmailManager {

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: /true/i.test(process.env.SMTP_SECURE) ? true : false,
            ignoreTLS: /true/i.test(process.env.SMTP_IGNORE_TLS) ? true : false,
            auth: (process.env.SMTP_USER && process.env.SMTP_PASS) ? {
                type: process.env.AUTH_TYPE ? process.env.AUTH_TYPE : 'login',
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            } : null
        });
    }

    recovery(to, url, user) {

        return new Promise((resolve, reject) => {

            var email = new Email({
                transport: this.transporter,
                send: true,
                preview: false,
            });

            email.send({
                template: 'recovery',
                message: {
                    from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
                    to: to,
                },
                locals: {
                    appName: process.env.APP_NAME,
                    name: user.name,
                    url,
                    username: user.username,
                    title: "Recuperacion de Contraseña",
                    description: "Hemos recibido tu solicitud para recuperar tu contraseña, podras hacerlo desde el siguiente link:",
                    btnText: "Recuperar Contraseña",
                    copyright: "Copyright @ " + process.env.APP_NAME + " " + new Date().getFullYear()
                },
            }).then(() => {
                resolve(true)
            }).catch(error => {
                winston.error('UserEmailManager.recovery ', error)
                reject(error)
            })

        })

    }

    recoveryCode(to, code, user) {

        return new Promise((resolve, reject) => {

            var email = new Email({
                transport: this.transporter,
                send: true,
                preview: false,
            });

            email.send({
                template: 'codeRecovery',
                message: {
                    from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
                    to: to,
                },
                locals: {
                    appName: process.env.APP_NAME,
                    name: user.name,
                    url:"",
                    username: user.username,
                    title: "Recuperacion de Contraseña",
                    description: "Hemos recibido tu solicitud para recuperar tu contraseña, podras hacerlo con el siguiente codigo:",
                    btnText: code,
                    copyright: "Copyright @ " + process.env.APP_NAME + " " + new Date().getFullYear()
                },
            }).then(() => {
                resolve(true)
            }).catch(error => {
                winston.error('UserEmailManager.recoveryCode ', error)
                reject(error)
            })

        })

    }

    activation(to, url, user) {
        return new Promise((resolve, reject) => {
            var email = new Email({
                transport: this.transporter,
                send: true,
                preview: false,
            });

            email.send({
                template: 'activation',
                message: {
                    from: process.env.APP_NAME + "<" + process.env.SMTP_USER + ">",
                    to: to,
                },
                locals: {
                    appName: process.env.APP_NAME,
                    name: user.name,
                    url,
                    username: user.username,
                    title: "Activación de cuenta",
                    description: "Hemos recibido tu solicitud de registro, para terminar de activar tu cuenta, accede al siguiente link:",
                    btnText: "Activar cuenta",
                    copyright: "Copyright @ " + process.env.APP_NAME + " " + new Date().getFullYear()
                },
            }).then((response) => {
                resolve(true)
            }).catch((error) => {

                winston.error('UserEmailManager.activation ', error)
                reject(error)
            })
        })
    }


    async sendmail({from, to, subject, text, html}) {
        let info = await this.transporter.sendMail({
            from: from,
            to: to, //LIST  1,2,3
            subject: subject,
            text: text,
            html: html
        });


        return info;
    }

}

module.exports = new UserEmailManager();
