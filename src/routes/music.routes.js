const {Router} = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {unlink} = require('fs-extra');
const ObjectId = require('mongoose').Types.ObjectId;
const Songs = require('../models/Songs');
const Lista = require('../models/Lista');
const User = require('../models/User');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/music');
    },
    filename: (req, file, cb, filename) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage,
                       fileFilter: (req, file, cb) =>{
                        const filetypes = /mp3|mpeg/;
                        const mimetype = filetypes.test(file.mimetype);
                        const extname = filetypes.test(path.extname(file.originalname));
                        if (mimetype && extname){
                            return cb(null, true);
                        } cb("ERROR: NO ES UN ARCHIVO MP3");
                       }
});

const { renderDashboard,
    renderMusicUpload
    } = require('../controllers/routes.controller');

const {isAuthenticated} = require('../helpers/Validate')
const {grantAccess} = require('../controllers/users.controller')

//Dashboard
router.get('/dash', isAuthenticated, renderDashboard);

router.get('/admin', isAuthenticated, (req, res) => {
    res.render('users/admin')
});

// Subir canciones
router.get('/subir', isAuthenticated, renderMusicUpload);

router.post('/subircancion', upload.single('track'), async (req, res) => {
    const Cancion = new Songs();
    Cancion.nombre = req.body.nombre;
    Cancion.artista = req.body.artista;
    Cancion.genero = req.body.genero;

    Cancion.filename = req.file.filename;
    Cancion.originalname = req.file.originalname;
    Cancion.mimetype = req.file.mimetype;
    Cancion.ruta = 'src/public/music/' + req.file.filename;

    await Cancion.save();
    req.flash('success_msg', 'Cancion Guardada.');
    res.redirect('/manage-songs');
});

//Obtener todas las canciones y buscar
router.get('/songs', isAuthenticated, async (req, res) => {
    const songs = await Songs.find();
    res.render('music/songs', {songs});
});

router.get('/manage-songs', isAuthenticated, async (req, res) => {
    const songs = await Songs.find();
    res.render('music/songsadmin', {songs});
});

router.get('/find', isAuthenticated, async (req, res) => {
    res.render('music/find');
});

router.post('/find', isAuthenticated, async (req, res) => {
    let payload = req.body.payload.trim();
    let search = await Songs.find({nombre: {$regex: new RegExp('^'+payload+'.*','i')}}).exec();
    //Limitar la busqueda a 10 en caso de que existan mas canciones en la base de datos
    search = search.slice(0, 10);
    res.send({payload: search});
});

//Reproducir Cancion
router.get('/play/:id', async (req, res) => {
    try {
        const songs = await Songs.findById(req.params.id);
        const range = req.get('range');
        if (!range) {
            res.status(400).json({ message: "No range specified" });
          }
    
    fs.access(songs.ruta, (err) => {
            if (!err) {
            console.log('file exists');
            return;
        }
    console.log('file does not exist');
    });      

    const audioPath = songs.ruta;
    const audioSize = fs.statSync(audioPath).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1);

    // headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${audioSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "audio/mp3",
    };

    res.writeHead(206, headers);

    console.log(audioPath);
    // create audio stream for each chunk
    const audioStream = fs.createReadStream(audioPath, { start, end });

    // Audio stream
    audioStream.pipe(res, (err) => {
        if (err) {
            Console.log('Error');
        }
    });

    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }

});

//Eliminar canciones del servidor
router.delete('/eliminar/:id', isAuthenticated, async (req, res) => {
    const song = await Songs.findByIdAndDelete(req.params.id);
    unlink(path.resolve(song.ruta));
    req.flash('success_msg','Cancion Eliminada');
    res.redirect('/manage-songs');
});

//Favoritos
router.get('/favs', isAuthenticated, async (req, res) => {
    const songs = await User.findOne({_id:ObjectId(req.session.objectId)}).populate('favorites').exec();
    res.render('music/favs', {songs});
});

router.post('/favs/add/:id', isAuthenticated, async (req, res) => {
    const songfav = req.params.id;
    const user = await User.findById(req.user.id);
    await User.update({"_id":user._id}, 
                        { $push: {favorites: songfav} });
    req.flash('success_msg','Cancion Añadida a Favoritos.');
    res.redirect('/songs');
});

router.post('/favs/remove/:id', isAuthenticated, async (req, res) => {
    const songfav = req.params.id;
    const user = await User.findById(req.user.id);
    await User.update({"_id":user._id}, 
                        { $pull: {favorites: songfav} });
    req.flash('success_msg','Cancion eliminada de Favoritos.');
    res.redirect('/favs');
});

//Crear Playlists
router.get('/playlists', isAuthenticated, async (req, res) => {
    const playlists = await Lista.find({user: req.user.id}).sort({createdAt: 'desc'});
    res.render('music/playlists', {playlists});
});

router.get('/playlists/create', isAuthenticated, (req, res) => {
    res.render('music/createlist');
});

router.post('/playlists/create', isAuthenticated, async (req, res) => {
    const {name} = req.body;
   const Playlist = new Lista({name});
    const user = await User.findById(req.user.id);
    await User.updateOne({"_id":user._id}, 
                        { $push: {listas: Playlist} });
   await Playlist.save();
   req.flash('success_msg', 'Playlist Creada!.');
    res.redirect('/playlists');
});

//Añadir a playlist

router.get('/playlists/edit', async (req, res) => {
    const playlist = await Lista.findById(req.params.id);
    res.render('music/edit-list', {playlist})
});
router.get('/playlists/edit/:id', async (req, res) => {
    const { name, email } = req.body;
        await List.findByIdAndUpdate(req.params.id, {name})
        req.flash('success_msg', 'Tu Playlist ha sido actualizada');
        res.redirect('/playlists');
});

router.get('/playlists/delete', isAuthenticated, (req, res) => {
    res.send('Delete playlists');
});


module.exports = router;