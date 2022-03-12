import BaseErrorModel from '../model/BaseErrorModel'

export const findBaseError = async function (id) {
    return new Promise((resolve, reject) => {
        BaseErrorModel.findOne({_id: id}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchBaseError = async function () {
    return new Promise((resolve, reject) => {
        BaseErrorModel.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const createBaseError = async function ( {name, lastname, age}) {

    const doc = new BaseErrorModel({
        name, lastname, age, color
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }

            doc.execPopulate(() => resolve(doc))
        }))
    })
}
