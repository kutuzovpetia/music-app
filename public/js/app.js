import Start from './start.js';
// var socket = io();

//Наполняет список подсказок
function setList(list){
    const listWrapper = document.querySelector('.list-group');
    listWrapper.textContent = '';
    list.forEach(name=>{
        const item = document.createElement('li');
        item.classList.add('list-group-item');
        item.textContent = name;
        listWrapper.append(item);
    })
    document.querySelectorAll('.list-group-item').forEach(item=>{
        item.addEventListener('click',(e)=>{
            console.log(e.target)
        })
    })
}

// Вешает событие (click) на item списка подсказок
function listItemTrigger(){
    document.querySelectorAll('form .list-group-item').forEach(item=>{
        item.addEventListener('click', function (e){
            console.log(e.target.closest('form').querySelector('input').value);
            e.target.closest('form').querySelector('input').value = e.target.textContent
        })

        item.addEventListener('touchstart', function (e){
            console.log(e.target.closest('form').querySelector('input').value);
            e.target.closest('form').querySelector('input').value = e.target.textContent
        })
    })
}

document.addEventListener('DOMContentLoaded', ()=>{
    const start = new Start();
    document.querySelector('input').addEventListener('input',  async function (e){
        await fetch('http://music-app-1v.herokuapp.com/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({data: this.value})
        }).then(data=>{
            return data.json();
        }).then(res=>{
          const list = document.querySelector('.list-group')
            let content = '';
            res.forEach(item=>{
                content += `<li class="list-group-item">${item}</li>`
            })
            list.innerHTML = content;

            document.querySelectorAll('.list-group-item').forEach(item=>{
                item.addEventListener('click',(e)=>{
                    this.value = e.target.textContent;
                })
            })
        })
    })

    document.querySelector('.btn-find').addEventListener('click', ()=>{
        document.querySelector('.list-group').innerHTML = '';
        const data = document.querySelector('input');
        start.requestOnServer('search', 'POST', data.value)
            .then(data=>{
                return data.json();
            }).then(async res=>{
            data.value = '';
            Start.createContent(res);
            Start.playTriggers();
        })
    })
})

