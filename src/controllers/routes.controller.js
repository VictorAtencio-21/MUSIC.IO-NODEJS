const musicController = {};

musicController.renderDashboard = (req, res) => {
    res.render('users/dashboard');
};

musicController.renderMusicUpload = (req, res) => {
    res.render('music/upload');
};


module.exports = musicController;