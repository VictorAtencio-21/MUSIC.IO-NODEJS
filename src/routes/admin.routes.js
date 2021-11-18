const {Router} = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

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

const { renderDashboardAdmin,
    renderMusicUpload,
    renderCreateAlbum, 
    renderAddCover, 
    getTrack} = require('../controllers/admin.controller');

const Songs = require('../models/Songs');


//Dashboard del Admin
router.get('/dashadm', renderDashboardAdmin);

//Escuchar canciones usuario admin
router.get('/play', async (req, res) => {
    const songs = await Songs.find();

    res.render('music/player', {songs});
});


// Subir y eliminar canciones
router.get('/subir', renderMusicUpload);

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
    
    req.flash('success', 'Cancion Subida Exitosamente');
    res.redirect('/play');
});


//Reproducir Cancion
router.get('/play/:id', async (req, res) => {
    try {
        const songs = await Songs.findById(req.params.id);
        const range = req.headers.range;
    if (!range) {
      res.status(400).json({ message: "no range specified" });
    }

    const audioPath = path.resolve(__dirname, "../public/music/", songs.path);
    const audioSize = fs.statSync(audioPath).size;

    const CHUNK_SIZE = 10 ** 5; // 100 KB
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
    audioStream.pipe(res);

    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }

});

router.delete('/eliminar/:id', async (req, res) => {
    await Songs.findByIdAndDelete(req.params.id);
    res.redirect('/play');
});

//Crear Playlists
router.get('/playlists/'), (req, res) => {
    res.send('All playlists');
};

router.get('/playlists/create'), (req, res) => {
    res.send('Create playlists');
};

router.get('/playlists/delete'), (req, res) => {
    res.send('Delete playlists');
};

//Crear Albumes y Subir sus covers
router.get('/crearalbum', renderCreateAlbum);

router.get('/addcover', renderAddCover);

module.exports = router;