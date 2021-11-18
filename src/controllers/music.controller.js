const musicController = {};
const path = require('path');
const fs = require('fs')

musicController.renderDashboardUser = (req, res) => {
    res.send('Dashboard User');
};

musicController.renderPlayMusicUser = (req, res) => {
    res.render('music/Player');
};

musicController.renderEditdUser = (req, res) => {
    res.send('Editar Usuario');
};

musicController.EditdUser = (req, res) => {
    res.send('Usuario editado');
}

musicController.renderPlaylistUser = (req, res) => {
    res.send('Playlists del Usuario');
};

musicController.renderPlaylistForm = (req, res) => {
    res.send('Formulario para crear playlist');
}

musicController.createPlaylist = (req, res) => {
    res.send('Playlist');
}

musicController.updatePlaylist = (req, res) => {
    res.send('Actualizar Playlists del Usuario');
}

musicController.deletePlaylist = (req, res) => {
    res.send('Playlist Eliminada');
}

musicController.renderEditPlaylist = (req, res) => {
    res.send('Editar playlists del Usuario');
}

musicController.renderBuscarUser = (req, res) => {
    res.send('Buscar Cancion/Album/Grupo');
};

module.exports = musicController;