const {Router} = require('express');
const router = Router();


const {renderDashboardUser, 
    renderPlayMusicUser, 
    renderEditdUser, 
    EditdUser, 
    renderPlaylistUser, 
    renderBuscarUser, 
    renderEditPlaylist, 
    updatePlaylist, 
    createPlaylist, 
    renderPlaylistForm, 
    deletePlaylist} = require('../controllers/music.controller');

//Dashboard de un usuario comun
router.get('/dashboard', renderDashboardUser);

//Editar informacion del usuario
router.get('/editar', renderEditdUser);

router.put('/editar', EditdUser);

// Buscar canciones, grupos, o albumes
router.get('/buscar/canciones', renderBuscarUser);

router.get('/buscar/grupos', renderBuscarUser);

router.get('/buscar/album', renderBuscarUser);

//Reproducir canciones
router.get('/play', renderPlayMusicUser);

//Visualizar Playlists del usuario
router.get('/playlists', renderPlaylistUser);

//Crear Listas de reproduccion, editarlas y eliminarlas
router.get('/crearplaylists', renderPlaylistForm);

router.post('/crearplaylists', createPlaylist);

router.get('/playlists/edit/:id', renderEditPlaylist);

router.put('/playlists/edit/:id', updatePlaylist);

router.delete('playlists/delete/:id', deletePlaylist);

module.exports = router;