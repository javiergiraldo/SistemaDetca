const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User')

passport.use(new LocalStrategy({
    usernameField: 'correo',
    passwordField: "contraseña_us",
}, async (correo, contraseña_us, done) => {
    const user = await User.findOne({ correo: correo });
    if (!user) {
        return done(null, false, { message: "Correo no existe" });
    } else {
        // bcrypt.compare(contraseña_us, (err, isMatch) => {
        //                 if (err) throw err;
        //                 if (isMatch) {
        //                     return done(null, user);
        //                 } else {
        //                     return done(null, false, { message: 'Contraseña incorrecta' });
        //                 }
        //             });
        const match = await user.matchPassword(contraseña_us);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Contraseña Incorrecta.' });
        }
    }
}));
    // Match password
    // bcrypt.compare(contraseña_us, user.contraseña_us, (err, isMatch) => {
    //     if (err) throw err;
    //     if (isMatch) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false, { message: 'Contraseña incorrecta' });
    //     }
    // });

// passport.use(new LocalStrategy(function (correo, contraseña_us, done) {
//     User.findOne({ correo: correo }, function (err, user) {
//         if (err) return done(err);
//         if (!user) return done(null, false, { message: 'Correo incorrecto.' });
            ////const match = await user.matchPassword(contraseña_us);
//         user.comparePassword(contraseña_us, function (err, isMatch) {
//             if (isMatch) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: 'Contraseña incorrecta.' });
//             }
//         });
//     });
// }));


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user); 
//     });
// });
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});