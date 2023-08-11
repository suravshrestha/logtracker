const User = require("../models/User");

const initialUsers = [
  {
    name: "John Doe",
    username: "johndoe123",
    password: "ilovejohndoe",
    email: "johndoe@pcampus.edu.np",
    userstatus: "student",
  },
  {
    name: "Jane Doe",
    username: "janedoe123",
    password: "ilovejanedoe",
    email: "janedoe@pcampus.edu.np",
    userstatus: "student",
  },
  {
    name: "Janet Doe",
    username: "janetdoe123",
    password: "ilovejanetdoe",
    email: "janetdoe@pcampus.edu.np",
    userstatus: "student",
  },
  {
    name: "Johnny Doe",
    username: "johnnydoe123",
    password: "ilovejohnnydoe",
    email: "johnnydoe@pcampus.edu.np",
    userstatus: "student",
  },
];

const usersInDb = async () => {
  return await User.find({});
};

module.exports = {
  initialUsers,
  usersInDb,
};
