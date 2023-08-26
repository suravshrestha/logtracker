const mongoose = require("mongoose");


//Models
const FileSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
    },
    submittedDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type : String
    },
    attachment: [{
        name: String,
        fileId: String,
        docs: {
            data: Buffer,
            contentType: String
        }
    }]
});


const File = module.exports = mongoose.model("File", FileSchema, "files");

module.exports.addFile = function (newFile, callback) {
    newFile.save(callback);
};

module.exports.getFilesbyProjectId = function (pId, callback) {
    const query = {
      projectId: pId
    };
    File.find(query, callback);
  };
