const {Router} = require('express');
const YoutubeMusicApi = require('youtube-music-api');
const router = Router();
const api = new YoutubeMusicApi();
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

// Главная страница *************************
router.get('/', (req, res)=>{
    res.render('index', {
        title: 'Music'
    });
});
//********************************************

// Живой поиск *******************************
router.post('/', async (req, res)=>{
    const api = new YoutubeMusicApi();
    await api.initalize()
        .then((info)=>{
            if(req.body.data){
                api.search(req.body.data, "SONG")
                    .then(result => {
                        res.send(result)
                    })
            }
        });
})
// ********************************************

// Поиск музыки *******************************
router.post('/search', async (req, res)=>{
    // console.log(req.body.data)
    await api.initalize()
        .then((info)=>{
            if(req.body.data){
                api.search(req.body.data, "SONG")
                    .then(async result => {
                        console.log(result);
                        res.send(result);
                    })
            }else {
                res.redirect('/');
            }
        })
})
//***********************************************

//Получить следующие 20
router.post('/more', async (req, res)=>{
    console.log(req.body)
   await api._getContinuation('search', req.body).then(more=> {
        res.send(JSON.stringify(more));
    })
})

//Получить подсказки
router.post('/suggestions', async (req, res)=>{
    await api.initalize()
        .then((info)=>{
            api.getSearchSuggestions(req.body.data)
                .then(result => {
                    res.send(result)
                })
        });
})
//***********************************************

// Загрузка файла *******************************
router.post('/download', async (req, res)=>{
    var YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
        "outputPath": "public/downloads",       // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    YD.download(req.body.id);
    YD.on("finished", function(err, data) {
        res.send(JSON.stringify(data))
    });

    YD.on("progress", function(progress) {
        console.log(JSON.stringify(progress.progress.percentage))
    });

    YD.on("error", function(error) {
        console.log(error);
    });
})
//*************************************************

module.exports = router;