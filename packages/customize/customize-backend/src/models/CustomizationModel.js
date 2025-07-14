import {mongoose} from '@dracul/common-backend';

const Schema = mongoose.Schema;

const colorsSchema = new mongoose.Schema({
    primary: {type: String, required: true},
    onPrimary: {type: String, required: true},
    secondary: {type: String, required: true},
    onSecondary: {type: String, required: true},
    background: {type: String, required: true},
    appBar: {type: String, required: true},
    onAppBar: {type: String, required: true},
})

const logoSchema = new mongoose.Schema({
    mode: {type: String, required: true},
    title: {type: String, required: false},
    filename: {type: String, required: false},
    url: {type: String, required: false}
})


const CustomizationSchema = new Schema({
    colors: colorsSchema,
    lightTheme: colorsSchema,
    darkTheme: colorsSchema,
    logo: logoSchema,
    language: {type: String, required: true}
});


export const Customization = mongoose.model('Customization', CustomizationSchema);
export default Customization;
