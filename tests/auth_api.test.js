const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./auth_api_test_helper");
const app = require("../app");

// superagent object
const api = supertest(app);

const User = require("../models/User");
const Status = require("../models/Status");

beforeEach(async () => {
  await User.deleteMany({});
  await Status.deleteMany({});

  const userObjects = helper.initialUsers.map((user) => new User(user));

  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});

describe("addition of a new user", () => {
  test("succeeds with valid data", async () => {
    const newUser = {
      name: "Linus Torvalds",
      username: "linustorvalds",
      password: "iloveopensource",
      email: "torvalds@pcampus.edu.np",
      userstatus: "teacher",
    };

    await api
      .post("/auth/signup")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    const usernames = usersAtEnd.map((r) => r.username);

    // One additional admin user is automatically created on first run
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 2);
    expect(usernames).toContain("linustorvalds");
  });

  test("fails with status code 400 when username, email or password is missing", async () => {
    const userWithoutUsername = {
      name: "Robert C. Martin",
      password: "ilovecleancode",
      email: "unclebob@ioe.edu.np",
      userstatus: "teacher",
    };

    const userWithoutPassword = {
      name: "Robert C. Martin",
      username: "unclebob123",
      email: "unclebob123@ioe.edu.np",
      userstatus: "teacher",
    };

    const userWithoutEmail = {
      name: "Robert C. Martin",
      username: "unclebob1234",
      password: "ilovecleancode",
      userstatus: "teacher",
    };

    await api.post("/auth/signup").send(userWithoutUsername).expect(400);
    await api.post("/auth/signup").send(userWithoutPassword).expect(400);

    const response = await api
      .post("/auth/signup")
      .send(userWithoutEmail)
      .expect(400);

    expect(response.body.error).toBe("Please fill in all required fields.");
  });

  test("fails with status code 400 when username is already taken", async () => {
    const user = { ...helper.initialUsers[0], email: "dummy@ioe.edu.np" };
    const response = await api.post("/auth/signup").send(user).expect(400);

    expect(response.body.error).toBe(
      "This username is already registered. Please log in to continue."
    );
  });

  test("fails with status code 400 when email is already taken", async () => {
    const user = { ...helper.initialUsers[0], username: "anonymous" };
    const response = await api.post("/auth/signup").send(user).expect(400);

    expect(response.body.error).toBe(
      "This email is already registered. Please log in to continue."
    );
  });

  test("fails with status code 400 when email is outside domain 'edu.np'", async () => {
    const user = {
      name: "Alice Smith",
      username: "alice1234",
      password: "securepass1",
      email: "alice@example.com",
      userstatus: "student",
    };

    const response = await api.post("/auth/signup").send(user).expect(400);

    expect(response.body.error).toBe(
      "Please provide a valid email address with domain 'edu.np'."
    );
  });

  test("fails with status code 400 when password is less than 8 characters", async () => {
    const user = {
      name: "Eleven",
      username: "077BCT089",
      password: "pass",
      email: "eleven@ioe.edu.np",
      userstatus: "student",
    };

    const response = await api.post("/auth/signup").send(user).expect(400);

    expect(response.body.error).toBe(
      "Password must be at least 8 characters long."
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
