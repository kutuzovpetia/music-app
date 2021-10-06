class Start{
    constructor() {
        this._URL = 'https://music-app-1v.herokuapp.com/';
        this.input = document.querySelector('input');
        this.value = this.input.value;
    }

    //Выполянет запрос к серверу
    async requestOnServer(url = '', method = 'GET', data){
        const res = await fetch(this._URL + url, {
            method: method,
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({data})
        })
        return res;
    }

    //Создает список аудио
    static createContent(res){
        const musicList = document.querySelector('.music-list');

        musicList.innerHTML = `
            <table class="table table-dark table-striped">
                <thead>
                <tr>
                    <th scope="col">№</th>
                    <th scope="col">Исполнитель</th>
                    <th scope="col">Название</th>
                    <th scope="col">
                    <button class="btn btn-warning btn-more">
                        Показать еще 
                        <i class="bi bi-arrow-right-circle"></i>
                    </button>
                    </th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
            `
        document.querySelector('table tbody').innerHTML = this.addItemInTable(res.content);
        let next = res.continuation;
        document.querySelector('.btn-more').addEventListener('click', async ()=>{
                await fetch('https://music-app-1v.herokuapp.com/more', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(next)
                }).then(data=>{
                    return data.json();
                }).then(res=>{
                    document.querySelector('table tbody').innerHTML = this.addItemInTable(res.content);
                    this.playTriggers();
                })
        })
    }

    static addItemInTable(array){
        console.log('ADD')
        let content = '';
        array.forEach((item, i)=>{

            content += `
                        <tr>
                            <th scope="row">${i+1}</th>
                            <td>${item.artist.name}</td>
                            <td>${item.name}</td>
                            <td class="d-flex justify-content-between align-items-center">
                                <img src="${item.thumbnails[0].url}" alt="thumb">
                                <div class="spinner-grow text-info" role="status">
                                  <span class="visually-hidden"></span>
                                </div>
                                    <i class="bi bi-play-circle" data-audioId="${item.videoId}" data-url=""></i>
                                    <i class="bi bi-pause-circle"></i>
                                    <i class="bi bi-film" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                            </td>
                        </tr>
                    `
        })
        return content;
    }

    // Вешает event на кнопки PLAY
    static playTriggers(){

        const btnPlay = document.querySelectorAll('.bi-play-circle'); // Список кнопок PLAY
        const btnPause = document.querySelectorAll('.bi-pause-circle'); // Список кнопок PAUSE
        const audioPlayer = document.querySelector('audio'); // Player

        //Получает сылку на песню
        async function loadSong(item, url){
            const URL = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({id: item.getAttribute('data-audioId')})
            })
            return URL
        }

        // скрывает кнопки pause
        function pauseOff(arrPause){
            arrPause.forEach(pause=>{
                if(pause.style.display === 'block'){
                    pause.style.display = 'none';
                    pause.previousElementSibling.style.display = 'block';
                }
            })
        }

        btnPlay.forEach(btn =>{
            btn.addEventListener('click', function (e){
                if(btn.getAttribute('data-url')){

                    pauseOff(btnPause);

                    audioPlayer.src = btn.getAttribute('data-url');
                    audioPlayer.play();
                    if(btn.style.display === 'block'){
                        btn.style.display = 'none';
                        btn.nextElementSibling.style.display = 'block';
                    }else{
                        btn.nextElementSibling.style.display = 'none';
                        btn.style.display = 'block';
                    }

                }else{

                    btn.previousElementSibling.style.display = 'block'; // Спинер ON
                    btn.style.display = 'none'; // Скрыли кнопку

                    loadSong(btn, 'https://music-app-1v.herokuapp.com/download')
                        .then(data=>{
                            return data.json()
                        })
                        .then(res=>{
                            const {file} = res;
                            const url = file.substr(6, file.length);
                            btn.setAttribute('data-url', url);

                            audioPlayer.style.display = 'block';
                            audioPlayer.src = url;

                            btn.previousElementSibling.style.display = 'none'; // Спинер OFF
                            btn.nextElementSibling.style.display = 'block';
                            btn.style.color = '#198754';
                            btn.nextElementSibling.style.color = '#198754'

                            btnPause.forEach(pause=>{
                                if(pause === btn.nextElementSibling){
                                    pause.style.display = 'block';
                                }else{
                                    if(pause.style.display === 'block'){
                                        pause.style.display = 'none';
                                        pause.previousElementSibling.style.display = 'block';
                                    }
                                }
                            })

                            // audioPlayer.addEventListener("canplaythrough", event => {
                                audioPlayer.play();

                            // });

                            audioPlayer.addEventListener('pause', ()=>{
                                pauseOff(btnPause);
                            })
                        })
                }

                btnPause.forEach(item=>{
                    item.addEventListener('click', ()=>{
                        audioPlayer.pause();
                        // item.style.display = 'none';
                        // item.previousElementSibling.style.display = 'block';
                        pauseOff(btnPause);
                    })
                })
            })
        })

        //play video
        const btnVideo = document.querySelectorAll('.bi-film');
        const modal = document.querySelector('.modal-dialog');
        const iframe = document.querySelector('iframe');
        btnVideo.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                iframe.src = `https://www.youtube.com/embed/` + btn.previousElementSibling.getAttribute('data-audioid');
            })
        })

    }
}

export default Start;
