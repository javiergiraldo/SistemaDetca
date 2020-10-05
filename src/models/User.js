const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
//var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
     //Colección o tabla usuario
    nombre: {type: String,  required: true},
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña_us: { type: String, required: true },
    isAdmin: {type: Boolean, default:false},
    resetPasswordToken: String,
    resetPasswordExpires: Date
    //date: { type: Date, default: Date.now }
});

//Encriptar conbtraseña
UserSchema.methods.encryptPassword = async (contraseña_us) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(contraseña_us, salt);
    return hash;
};



UserSchema.methods.matchPassword = async function (contraseña_us) {
    return await bcrypt.compare(contraseña_us, this.contraseña_us);
};

   
    
    
//save function -- hashes and then saves the password


//Comparando las contraseñas del ususario y bd
// UserSchema.methods.comparePassword = function (candidatePassword) {
//     bcrypt.compare(candidatePassword, this.contraseña_us, function (err, isMatch) {
//         if (err) return next(err);
//         done(null, isMatch);
//     });
// };

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);