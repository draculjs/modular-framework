import path from "path";
import uploadFileSimulator from "./utils/uploadFileSimulator";
import { uploadLogo, findCustomization } from "../src/services/CustomizationService";
import assert from "assert";

describe("createNotificationService", () => {

    it('Logo Upload Validation mimetype Not Allowed', async () => {

        let filePath = path.join(__dirname,'../test/assets/','Dracul.pdf')
        let file = uploadFileSimulator(filePath)

        return assert.rejects(uploadLogo(file), {
            name: "Error",
            message: "MIMETYPE_NOT_ALLOWED"
        })
    });

    it('Logo Upload Succes', async () => {
        let filePath = path.join(__dirname,'../test/assets/','VladDracul.png');
        let file = await uploadFileSimulator(filePath);

        let upload = await uploadLogo(file);

        assert.strictEqual(upload.filename, "VladDracul.png");
        assert.strictEqual(upload.mimetype, "image/png");
    });


     it('Logo Upload Validation size Fail', async () => {
         let filePath = path.join(__dirname,'../test/assets/','big.png')
            let file = uploadFileSimulator(filePath)

         return assert.rejects(uploadLogo(file), {name: 'Error', message:'MAX_FILE_SIZE_EXCEEDED'})
     });

});