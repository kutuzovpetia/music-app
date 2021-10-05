const express = require('express');
const path = require('path');
const app = express();
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const cors = require('cors');

// Socket IO *********************************************
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//********************************************************

// Роуты
const homeRouter = require('./routers/homeRoute');
//********************************************************

// Настройки express-handlebars ***************************
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

// Настройка HBS
app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
// *********************************************************

app.use(express.static(path.join(__dirname, 'public'))); // Указываем статику
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap-icons')));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(homeRouter);

io.on('connection', (socket) => {
    console.log("Успешное соединение");
    socket.on('disconnect', ()=>{
        console.log("Отключен!");
    });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    try{
        console.log(`Server is started on ${PORT}`);
    }
    catch (err){
        throw err
    }
})
