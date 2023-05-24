import {mongoose} from '@dracul/common-backend';
import { MongoMemoryServer } from 'mongodb-memory-server';




class MongoInMemory{

    mongoServer

    static async connect(){

        if(this.mongoServer === undefined){
            this.mongoServer = await MongoMemoryServer.create();
        }

        if(this.serverStatus === "new"){
            await this.mongoServer.start()
        }

        if(!mongoose.connection.readyState){
            await mongoose.connect(this.mongoServer.getUri(), { dbName: "verifyMASTER" });
        }
        return
    }

    static get mongooseStatus(){
        return mongoose.connection.readyState
    }

    static get serverStatus(){
        return this.mongoServer.state
    }

    static get status(){
        return mongoose.connection.readyState
    }

    static async disconnect(){
        await mongoose.disconnect();
    }

    static async DropAndClose(){
        if (this.serverStatus == "running") {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
            await this.mongoServer.stop();
        }
    }
}

export default MongoInMemory
