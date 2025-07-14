export default function randomNumber(length = 4) {
    try {
        let result = '';
        
        const characters = '0123456789';
    
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    
        return result;
    } catch (error) {
        DefaultLogger.error(`An error happened at randomNumber: ${error}`)
    }
}
