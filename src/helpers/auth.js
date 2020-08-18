const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        //res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0')
        return next();
    }
    req.flash('error_msg', 'Has cerrado session');
    res.redirect('/signin');
};
   

module.exports = helpers;