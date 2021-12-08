const mongoose = require('mongoose');

const ListaSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    user: { 
        type: String, ref: "User", required: true 
    },
    songs: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Songs" 
    }]
},{
    timestamps: true
});

const Lista = mongoose.model('Lista', ListaSchema);
module.exports = Lista;