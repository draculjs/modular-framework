export const passwordRules =  {
    regex: (process?.env?.PASSWORD_REGEX ? process.env.PASSWORD_REGEX : '.*') ,
    requirements: process?.env?.PASSWORD_REQUIREMENTS
}

export const validateRegexPassword = function(password){
    const r = new RegExp(passwordRules.regex);
    return r.test(password);
}

export const decodePassword =  function(str){
     return Buffer.from(str, 'base64').toString();
}


export const encodePassword =  function(str){
    return Buffer.from(str).toString('base64')
}
