const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// passport config
require('./config/passport')(passport);

const PORT = process.env.PORT || 3000;

// DB config
const db = require("./config/keys.js").MongoURI;

// session management
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.failure_msg = req.flash("failure_msg");
    res.locals.error = req.flash("error");
    next();
})


// connnection
mongoose.connect(db)
    .then(() => { console.log("Mongodb connected..") })
    .catch((err) => { console.log(err) });

// body-parser
app.use(express.urlencoded({ extended: false }));

// EJS 
app.use(expressLayouts);
app.set('view engine', "ejs");

// routes
app.use("/", require("./routes/index.js"));

app.use("/users", require("./routes/users.js"));

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
})