const mongoose = require('mongoose')


const checkSchema = new mongoose.Schema({
    userId: {
        type: String
    }
    
},{versionKey: false})

module.exports = mongoose.model('group',checkSchema)