var mongoose = require('mongoose')

var StatusSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
})

var Status = module.exports = mongoose.model('Status', StatusSchema, 'status');
