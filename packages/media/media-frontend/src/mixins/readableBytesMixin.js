import redeableBytes from '../helpers/redeableBytes'

export default {
    computed: {
        redeableBytes(){
            return (bytes) => redeableBytes(bytes)
        }
    }
}