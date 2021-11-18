const mongoose = require('mongoose');

const USER = "victor";
const PASSWORD = "passwordroot";
const DATA_BASE = "Proyecto-Node";

//Datos de la conexion
const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const CONECTOR = `mongodb+srv://${USER}:${PASSWORD}@clusterappnode.virbt.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`;

mongoose.connect(CONECTOR, OPTIONS, MongoError => {
    if (MongoError) {
        console.error(MongoError);
        process.exit(1);
    } else {
        console.log('Database conectada') ;
    }
}); 