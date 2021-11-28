const {Router} = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {unlink} = require('fs-extra');

const Songs = require('../models/Songs');

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

const {isAuthenticated} = require = require('../helpers/Validate')

//Dashboard del Admin
router.get('/dash', isAuthenticated, renderDashboard);


// Subir y eliminar canciones
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
    res.redirect('/play');
});

router.get('/play', isAuthenticated, async (req, res) => {
    const songs = await Songs.find();

    res.render('music/player', {songs});
});

//Reproducir Cancion
router.get('/play/:id', isAuthenticated, async (req, res) => {
    try {
        const songs = await Songs.findById(req.params.id);
        const range = req.headers.range;
        console.log(req.headers.range)
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
      "Content-Type": req.file.mimetype,
    };

    res.writeHead(206, headers);

    console.log(audioPath);
    // create audio stream for each chunk
    const audioStream = fs.createReadStream(audioPath, { start, end });

    // Audio stream
    audioStream.pipe(res, (err) => {
        if (err) {
            Console.log('Vergacion');
        }
    });

    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }

});

router.delete('/eliminar/:id', isAuthenticated, async (req, res) => {
    const song = await Songs.findByIdAndDelete(req.params.id);
    unlink(path.resolve(song.ruta));
    req.flash('success_msg','Cancion Eliminada');
    res.redirect('/play');
});

//Crear Playlists
router.get('/playlists'), isAuthenticated, (req, res) => {
    res.send('All playlists');
};

router.get('/playlists/create'), isAuthenticated, (req, res) => {
    res.send('Create playlists');
};

router.get('/playlists/delete'), isAuthenticated, (req, res) => {
    res.send('Delete playlists');
};

//Crear Albumes y recibir albums
router.get('/albums'), isAuthenticated, (req, res) => {
    res.send('All albums');
}

router.get('/albums/create'), isAuthenticated, (req, res) => {
    res.send('Crear Album');
}

router.get('/albums/delete'), (req, res) => {
    res.send('Delete Album');
}

module.exports = router;