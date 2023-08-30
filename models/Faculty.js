const mongoose = require("mongoose");

//Models
const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courses: [{
    semester: Number,
    subjects: [String]
  }],

});

const Faculty = mongoose.model("Faculty", FacultySchema, "faculties");

module.exports.addFaculty = function (newFaculty, callback) {
  newFaculty.save(callback);
};

module.exports = Faculty;

// module.exports.getSubjectsbyFacultySem = function (name, callback) {
//   const query = {
//     team: { $all: [name] },
//   };
//   Project.find(query, callback);
// };

// module.exports.getProjectsbySV = function (name, callback) {
//   const query = {
//     supervisor: name,
//   };
//   Project.find(query, callback);
// };
// module.exports.getProjectsbyCreator = function (name, callback) {
//   const query = {
//     createdBy: name,
//   };
//   Project.find(query, callback);
// };

// module.exports.getProjectsbyId = function (projectId, callback) {
//   const query = {
//     _id: projectId,
//   };
//   Project.find(query, callback);
// };

// module.exports.getProjectsbySemester = function (sem, callback) {
//   const query = {
//     semester: sem,
//   };
//   Project.find(query, callback);
// };

// module.exports.updateProject = function (projectId, newProject, callback) {
//   Project.findByIdAndUpdate(
//     projectId,
//     {
//       $set: {
//         description: newProject.description,
//         projectname:newProject.projectname,
//         description :  newProject.description,
//         supervisor : newProject.supervisor,
//         team :  newProject.team,
//         createdBy : newProject.createdBy,
//         semester : newProject.semester,
//         teamname :  newProject.teamname,
//       },
//     },
//     {
//       new: true,
//     },
//     callback
//   );
// };
