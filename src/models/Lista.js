const {Schema, model} = require('mongoose');

const ListaSchema = new Schema({
    nombre_lista :{
        type : String,
        required : true
    },
    owner :{
        type : String,
        required : true
    },
    canciones :[{
        type : mongoose.Schema.Types.ObjectId, ref:'Songs'
    }]
});

const Lista = mongoose.model('Lista', ListaSchema);
module.exports = Lista;