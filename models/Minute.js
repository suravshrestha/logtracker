var mongoose = require('mongoose')


//Models
var MinuteSchema = new mongoose.Schema({
    projectId: {
        type: String,
        default: 'todo',
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    updatedDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attachment: [{
        name: String,
        fileId: String,
        docs: {
            data: Buffer,
            contentType: String
        }
    }],
    createdBy: {
        type: String,
        default: 'username'
        //   required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    updatedBy: {
        type: String,
        default: 'updater',
        required: true
    }
})


var Minute = module.exports = mongoose.model('Minute', MinuteSchema, 'minutes')

module.exports.getMinutesbyPid = function (pid, callback) {
    let query = {
        projectId: pid
    }
    Minute.find(query, callback)
}

module.exports.createMinute = function (newMinute, callback) {
    newMinute.save(callback)
}
module.exports.updateMinutebyId = function (pid, minuteId, newMinute, callback) {
    let query = {
        projectname: pid
    }

    Minute.find(query, function (err, m) {
        if (err) throw err

        //minutes exist in database

        if (m.length > 0) {
            Minute.findOneAndUpdate({
                    projectname: pid,
                }, {
                    $set: {
                        projectId: pid,
                        title: newMinute.title,
                        description: newMinute.description,
                        updatedBy: todo
                    }
                }, {
                    new: true
                },
                callback
            )
        } else {
            newMinute.save(callback)
        }
    })
}

module.exports.verifyMinute = function (minuteId,callback) {
    let query = {
        _id: minuteId
    }

    Minute.find(query, function (err, m) {
        if (err) throw err

        //minutes exist in database

        if (m.length > 0) {
            Minute.findOneAndUpdate(query, {
                    $set: {
                       isVerified: true
                    }
                }, 
                {
                    new: true
                },
                callback
            )
        }
    })
}

module.exports.unVerifyMinute = function (minuteId,callback) {
    let query = {
        _id: minuteId
    }

    Minute.find(query, function (err, m) {
        if (err) throw err

        //minutes exist in database

        if (m.length > 0) {
            Minute.findOneAndUpdate(query, {
                    $set: {
                       isVerified: false
                    }
                }, 
                {
                    new: true
                },
                callback
            )
        }
    })
}