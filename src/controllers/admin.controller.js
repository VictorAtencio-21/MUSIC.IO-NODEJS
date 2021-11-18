const adminController = {};
const multer = require('multer');
const path = require('path');

adminController.renderDashboardAdmin = (req, res) => {
    res.render('users/dashboard');
};

adminController.renderMusicUpload = (req, res) => {
    res.render('music/upload');
};

adminController.renderCreateAlbum = (req, res) => {
    res.send('Crear Album');
};

adminController.renderAddCover = (req, res) => {
    res.send('Añadir Cover');
};


module.exports = adminController;