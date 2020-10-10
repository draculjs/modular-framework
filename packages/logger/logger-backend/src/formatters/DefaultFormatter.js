require('dotenv').config()
import DefaultTextFormatter from "./DefaultTextFormatter";
import DefaultJsonFormatter from "./DefaultJsonFormatter";

function DefaultFormatter(color) {

    switch (process.env.LOG_MODE) {
        case "JSON":
            return DefaultJsonFormatter()
        case "TEXT":
            return DefaultTextFormatter(color)
        default:
            return DefaultTextFormatter(color)
    }
}

export default DefaultFormatter