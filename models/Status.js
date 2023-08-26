const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
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
});

const Status = mongoose.model("Status", StatusSchema, "status");

module.exports = Status;
