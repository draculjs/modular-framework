const createEmptyFileOfSize = require ("./createEmptyFileOfSize");
const path = require("path");

let filePath = path.join(__dirname,'../assets/','big.png')
let size = 1024 * 1024 * 6
createEmptyFileOfSize(filePath,size)