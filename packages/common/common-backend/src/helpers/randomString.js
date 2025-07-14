export default function randomString(length = 4){
    try {
        let result = '';
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
    
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    } catch (error) {
        DefaultLogger.error(`An error happened at randomString: ${error}`)
    }
}