import path from "path";
import uploadFileSimulator from "./uploadFileSimulator";
import fileUpload from "../../src/modules/media/services/UploadService";

const PATH_FILES = ['../assets/imageone.png','../assets/imagetwo.png',
    '../assets/imagethree.jpeg',
    '../assets/imagefour.jpg',
    '../assets/imagefive.jpg',
    '../assets/imagesix.jpg']

export default async function uploadMultiFiles (user) {

    let index = 0
    let filePath;
    let file;

    while(index < PATH_FILES.length){
        filePath = path.join(__dirname,PATH_FILES[index])
        file = uploadFileSimulator(filePath)
        await fileUpload(user, file)
        index++
    }

}