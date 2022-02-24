const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId : {
        type: String
    },
    name: {
        type: String
    },
    referrer_id: {
        type: String
    },
    referral_count: {
        type: String
    },
    twitter: {
        type: String
    },
    reddit: {
        type: String
    },
    facebook: {
        type: String
    },
    wallet: {
        type: String
    }
},
{versionKey: false}

)

module.exports = mongoose.model('user',userSchema)