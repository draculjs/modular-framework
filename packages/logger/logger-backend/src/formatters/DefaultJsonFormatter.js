import  winston from "winston";

function DefaultJsonFormatter() {

    const {combine, timestamp, errors, json} = winston.format;


    return combine(
        errors({stack: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        json()
    );
}

export default DefaultJsonFormatter()