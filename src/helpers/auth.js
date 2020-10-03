const helpers = {};

//Metodo para eliminar las cookies y Cerrar sesion
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.user
        console.log(req.session.user);
        //res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0')
        return next();
    }
    // req.flash('error_msg', 'Has cerrado session');
    res.redirect('/signin'); //Inside a callback… bulletproof!
};
   

module.exports = helpers;