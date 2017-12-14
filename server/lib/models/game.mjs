import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    difficulty: String,
    highN: Number,
    avgN: Number,
    sequences: [{
        variates: {
            position: Boolean,
            color: Boolean,
            number: Boolean,
            audio: Boolean,
            shape: Boolean
        },
        nBack: Number,
        combos: [{
            position: Number,
            color: String,
            number: Number,
            audio: String,
            shape: String
        }],
        interval: Number,
        fatal: false
    }]
}, {
    timestamps: { timestamp: 'created_at' }
});

export default mongoose.model('Game', schema);
