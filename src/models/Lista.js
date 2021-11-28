const mongoose = require('mongoose');

const ListaSchema = new mongoose.Schema({
    nombre_lista :{
        type : String,
        required : true
    },
    owner :[{
        type: mongoose.Schema.Types.ObjectId, ref:'Users'
    }],
    canciones :[{
        type : mongoose.Schema.Types.ObjectId, ref:'Songs'
    }]
});

const Lista = mongoose.model('Lista', ListaSchema);
module.exports = Lista;