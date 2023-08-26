const config = require("./utils/config");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const connectDB = require("./utils/mongo");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

//Passport configs
require("./utils/passport")(passport);

//Load configs
connectDB();

//Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth")(passport);
const pwdResetRouter = require("./routes/pwdReset");
const minuteRouter = require("./routes/minute");
const projectRouter = require("./routes/project");
const facultyRouter = require("./routes/faculty");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Sessions
app.use(
  session({
    secret: config.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: config.MONGODB_URI,
    }),
  })
);

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.sess = req.session;
  next();
});

// parse application/json
app.use(bodyParser.json());

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(form.array())

//@Routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/pwdReset", pwdResetRouter);
app.use("/minute", minuteRouter);
app.use("/project", projectRouter);
app.use("/faculty", facultyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
