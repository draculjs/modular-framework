const {DefaultLogger} = require('@dracul/logger-backend')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const mongoConnect = async function(){

    if(!process.env.MONGO_URI){
        DefaultLogger.error("MongoDB connection error: process.env.MONGO_URI not found")
        throw new Error("process.env.MONGO_URI not found")
    }

    try{
        await connectToMongo(process.env.MONGO_URI)
        const db = mongoose.connection;

        db.on('error', function (){
            console.error.bind(console, 'connection error:')
            DefaultLogger.info("Reconnecting with MongoDB")
            setTimeout(() => connectToMongo(process.env.MONGO_URI), 3000)
        });

        db.once('open', function() {
            DefaultLogger.info("MongoDB Open")
        });

        const {ObjectId} = mongoose.Types;
        ObjectId.prototype.valueOf = function () {
            return this.toString();
        };

    }
    catch (error){
        DefaultLogger.error("Connection to Mongo error: "+error)
        throw new Error("Connection to Mongo error: "+error)
    }


}

const connectToMongo = function (mongoUri){

    return new Promise((resolve, reject) => {

        mongoose.Promise = global.Promise;

        mongoose.connect(mongoUri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false

            })
            .then(() => {
                DefaultLogger.info("Mongoose connected")
                resolve()
            })
            .catch(error => {
                DefaultLogger.error("Mongoose not connected", error)
                reject(error)
            });

    })

}

module.exports = mongoConnect
