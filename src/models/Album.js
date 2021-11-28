const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  nombre: String,
  artista: String,
  year: Number,
});

module.exports = mongoose.model("Album", albumSchema);