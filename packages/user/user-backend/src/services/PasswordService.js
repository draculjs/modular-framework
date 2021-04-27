
export const decodePassword =  function(str){
     return Buffer.from(str, 'base64').toString();
}


export const encodePassword =  function(str){
    return Buffer.from(str).toString('base64')
}