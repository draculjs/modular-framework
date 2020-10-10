require('dotenv').config()
import DefaultTextFormatter from "./DefaultTextFormatter";
import DefaultJsonFormatter from "./DefaultJsonFormatter";

function DefaultFormatter() {

    switch (process.env.LOG_MODE) {
        case "JSON":
            return DefaultJsonFormatter
        case "TEXT":
            return DefaultTextFormatter
        default:
            return DefaultTextFormatter
    }
}

export default DefaultFormatter()