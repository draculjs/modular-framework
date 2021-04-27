import {decodePassword, encodePassword} from "../../src/services/PasswordService"

describe("PasswordService", () => {

    test('Password with "ñ"', async () => {

        // contraseña encodeada en el front = "Y29udHJhc2XDsWE="
        let contraseñaEncodeada = "Y29udHJhc2XDsWE="
        let password = "contraseña"
        let decodedPassword = decodePassword(contraseñaEncodeada)
        
        expect (decodedPassword).toEqual(password)

    });

    test('Normal password', async () => {

        // palabraprueba encodeada en el front = "cGFsYWJyYXBydWViYQ=="
        let contraseñaEncodeada = "cGFsYWJyYXBydWViYQ=="
        let password = "palabraprueba"
        let decodedPassword = decodePassword(contraseñaEncodeada)
        
        expect (decodedPassword).toEqual(password)
    
    });

    test('Password with symbols', async () => {

        // palabraprueba encodeada en el front = "QCQuLWNvbnRyYXNlw7Fh"
        let contraseñaEncodeada = "QCQuLWNvbnRyYXNlw7Fh"
        let password = "@$.-contraseña"
        let decodedPassword = decodePassword(contraseñaEncodeada)

        expect (decodedPassword).toEqual(password)
    
    });

    test('Password with spaces', async () => {

        // palabra prueba encodeada en el front = "cGFsYWJyYSBwcnVlYmE="
        let contraseñaEncodeada = "cGFsYWJyYSBwcnVlYmE="
        let password = "palabra prueba"
        let decodedPassword = decodePassword(contraseñaEncodeada)
        
        expect (decodedPassword).toEqual(password)
    
    });

})

