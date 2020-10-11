require('dotenv').config()
import winston from "winston";

function DefaultJsonFormatter() {

    const {combine, timestamp, errors, json, prettyPrint} = winston.format;


    return combine(
        errors({stack: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        json(),
        prettyPrint()
    );
}

export default DefaultJsonFormatter