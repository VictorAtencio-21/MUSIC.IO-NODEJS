const {Schema, model} = require('mongoose');

const SongSchema = new Schema({
    nombre :{
        type : String,
        required : true
    },
    artista :{
        type : String,
        required : true
    },
    genero: {
        type : String,
    },
    filename: {
        type : String,
    },
    originalname: {
        type : String,
    },
    mimetype: {
        type : String,
    },
    ruta: {
        type : String,
        required : true
    }
});

module.exports = model('Songs', SongSchema);