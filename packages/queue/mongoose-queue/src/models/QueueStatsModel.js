import {mongoose} from '@dracul/common-backend';
const Schema = mongoose.Schema;

const QueueStatsSchema = new Schema({
    topic: {
        type: String,
        required: true,
        unique: true
    },
    added: {
        type: Number,
        required: false,
        default: 0
    },
    gotten: {
        type: Number,
        required: false,
        default: 0
    },
    failed: {
        type: Number,
        required: false,
        default: 0
    },
    done: {
        type: Number,
        required: false,
        default: 0
    }
})

const QueueStatsModel = mongoose.model('QueueStats', QueueStatsSchema);

module.exports = QueueStatsModel;
