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
    timestamps: { createdAt: 'timestamp' }
});


export default mongoose.model('Game', schema);



// {
//     "game": {
//       "__v": 0,
//       "difficulty": "easy",
//       "_id": "5a304e0cdeaf8da88b7dc992",
//       sequences: [
//         {
//           nBack: 10,
//           interval: 3,
//           fatal: false,
//           _id: 5a304e0cdeaf8da88b7dc9ad,
//           combos: [],
//           variates: {
//             position: true,
//             number: false,
//             color: false,
//             shape: true
//           }
//         },
//         {
//           nBack: 10,
//           interval: 3,
//           fatal: false,
//           _id: 5a304e0cdeaf8da88b7dc9a0,
//           combos: [],
//           variates: {
//             position: false,
//             number: true,
//             color: true,
//             shape: false
//           }
//         },
//         {
//           nBack: 10,
//           interval: 3,
//           fatal: false,
//           _id: 5a304e0cdeaf8da88b7dc993,
//           combos: [],
//           variates: {
//             position: true,
//             number: true,
//             color: false,
//             shape: false
//           }
//         }
//       ]
//     },
//     "user": {
//       "_id": "5a30337a8eedcc99842b60e8",
//       "name": "Zach",
//       "__v": 0,
//       "gameLog": [
//         "5a30358beda310a0281eeb06",
//         "5a303e89ad6733a16552b18d",
//         "5a303f0bad6733a16552b19b",
//         "5a30420d96ac55a554c97063",
//         "5a30427796ac55a554c97071",
//         "5a3042d696ac55a554c9707f",
//         "5a3046411ab3bca6e9375700",
//         "5a304695d07b4ea7378700b1",
//         "5a3046e5aef7eca76a28759c",
//         "5a304703aef7eca76a2875aa",
//         "5a30472c13fb71a779bebfbb",
//         "5a30474efdbbd8a78855f600",
//         "5a3047e93c1518a7da0e6083",
//         "5a30485f1dc646a7fae29dba",
//         "5a304be3deaf8da88b7dc917",
//         "5a304cafdeaf8da88b7dc925",
//         "5a304cd5deaf8da88b7dc933",
//         "5a304d94deaf8da88b7dc941",
//         "5a304da4deaf8da88b7dc95c",
//         "5a304de4deaf8da88b7dc984",
//         "5a304e0cdeaf8da88b7dc992"
//       ]
//     }
//   }
// Need to calculate avgN from nBack, 
// highN I need to make sure I store the Highest nBack the user has obtained.  

