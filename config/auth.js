module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('failure_msg', 'Please login to view this resource.');
        res.redirect("/users/login");
    }
}