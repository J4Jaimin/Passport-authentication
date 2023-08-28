const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    errors = [];

    // check required fields.
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields." });
    }

    // check password match
    if (password !== password2) {
        errors.push({ msg: "Password does not match." });
    }

    // check password length
    if (password.length < 6) {
        errors.push({ msg: "Password should be atleast 6 characters." });
    }

    console.log(errors);

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passed
        User.findOne({ email: email }).
            then((user) => {
                errors.push({ msg: "Email is already registered." });
                if (user) {
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(() => {
                                    req.flash("success_msg", "You are now registered and can login.");
                                    console.log("User registered successfully.")
                                    res.redirect("/users/login");
                                })
                                .catch((err) => console.log(err));
                        }));

                }
            });
    }
});

// login handle
router.post('/login', (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        req.flash("success_msg", "You are logged out.");
        res.redirect("/users/login");
    });
});

module.exports = router;