const mongoose = require('mongoose');
const { Schema } = mongoose;


const tipo_alertasSchema = new Schema({
     //Colección o tabla tipo_alertas
    nombre: {type: String,  required: true},
    cantidad: { type: Float32Array, required: true },
    fecha: {type: Date, required: true}
    });

    module.exports=mongoose.model('tipo_alertas', tipo_alertasSchema) 