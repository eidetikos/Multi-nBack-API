import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    hash: RequiredString,
    gameLog: [{
        type: Schema.Types.ObjectId, 
        ref: 'Game',
        required: true
    }],
    demographics: {
        age: Number,
        country: String,
        gender: String
    }
});

schema.loadClass(
    class {
        generateHash(password) {
            this.hash = bcrypt.hashSync(password, 7);
        }
        
        comparePassword(password) {
            return bcrypt.compareSync(password, this.hash);
        }
        
        static exists(query) {
            return this.find(query)
                .count()
                .then(count => (count > 0));
        }

        static mostSequencesByUser() {
            return this.aggregate([
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                },
                {
                    $unwind: '$gameLog',
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $project: {
                        sequences: '$gameLog.sequences.fatal',
                        name: true,
                    }
                },
                {
                    $group: {
                        _id: '$name',
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $project: {
                        _id: false,
                        name: '$_id',
                        count: '$count'
                    }
                },
                {
                    $limit: 10
                }
            ]);
        }

        static highestNBackPerDifficulty() {
            return this.aggregate([
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                },
                {
                    $unwind: '$gameLog'
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $project: {
                        _id: false,
                        name: true,
                        difficulty: '$gameLog.difficulty',
                        nBack: '$gameLog.sequences.nBack'
                    }
                },
                {
                    $group: {
                        _id: {
                            name: '$name',
                            difficulty: '$difficulty'
                        },
                        maxN: {
                            $max: '$nBack'
                        }
                    }
                },
                {
                    $sort: {
                        maxN: -1
                    }
                },
                {
                    $group: {
                        _id: '$_id.difficulty',
                        leaderboard: {
                            $push: {
                                name: '$_id.name',
                                maxN: '$maxN'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: false,
                        difficulty: '$_id' ,
                        leaderboard: true
                    }
                },
                {
                    $limit: 10
                }
            ]);
        }

        static topScoresPerDifficulty() {
            return this.aggregate([
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                },
                {
                    $unwind: '$gameLog' 
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $match: {
                        'gameLog.sequences.fatal': false
                    }
                },
                {
                    $project: {
                        _id: false,
                        game: '$gameLog._id',
                        name: true,
                        difficulty: '$gameLog.difficulty'
                    }
                },
                {
                    $group: {
                        _id: {
                            name: '$name',
                            difficulty: '$difficulty',
                            game: '$game'
                        },
                        score: {
                            $sum: 1
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            name: '$_id.name',
                            difficulty: '$_id.difficulty'
                        },
                        highestScore: {
                            $max: '$score'
                        }
                    }
                },
                {
                    $sort: {
                        highestScore: -1
                    }
                },
                {
                    $group: {
                        _id: '$_id.difficulty',
                        leaderboard: {
                            $push: {
                                name: '$_id.name',
                                highestScore: '$highestScore'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: false,
                        difficulty: '$_id',
                        leaderboard: true
                    }
                },
                {
                    $limit: 10
                }
            ]);
        }

        static usersSequencesCompleted(id) {
            return this.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                },
                {
                    $unwind: '$gameLog' 
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $group: {
                        _id: null,
                        sequencesCompleted: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: false,
                        sequencesCompleted: true
                    }
                }
            ]);
        }

        static usersMaxN(id) {
            return this.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                },
                {
                    $unwind: '$gameLog' 
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $group: {
                        _id: null,
                        maxN: {
                            $max: '$gameLog.sequences.nBack'
                        }
                    }
                },
                {
                    $project: {
                        _id: false,
                        maxN: true
                    }
                }
            ]);
        }

        static usersTopScore(id) {
            return this.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                },
                {
                    $unwind: '$gameLog' 
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $group: {
                        _id: '$gameLog._id',
                        score: {
                            $sum: 1
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        topScore: {
                            $max: '$score'
                        }
                    }
                },
                {
                    $project: {
                        _id: false,
                        topScore: true
                    }
                }
            ]);
        }

        static usersNBackLog(id) {
            return this.aggregate([
                
                {
                    $lookup: {
                        from: 'games',
                        localField: 'gameLog',
                        foreignField: '_id',
                        as: 'gameLog'
                    }
                }, 
                {
                    $unwind: '$gameLog'
                },
                {
                    $unwind: '$gameLog.sequences'
                },
                {
                    $match: { 'gameLog.timestamp': { $exists: true } }
                }, 
                {
                    $sort: { 'gameLog.timestamp': -1 }
                },
                {
                    $project: {
                        _id: true,
                        timestamp: '$gameLog.timestamp',
                        nBack: '$gameLog.sequences.nBack'
                    }
                },
                {
                    $group: {
                        _id: '$_id', 
                        nBackHistory: { $push: { nBack: '$nBack', timestamp: '$timestamp' }} 
                    }
                },
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $project: {
                        _id: false,
                        nBackHistory: true
                    }
                }

                
            ]);
                
        }
    }
);

export default mongoose.model('User', schema);
