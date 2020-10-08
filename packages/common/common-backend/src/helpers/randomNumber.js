const randomNumber =  function randomNumber(length = 4) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.randomNumber = randomNumber
module.exports =  randomNumber