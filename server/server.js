const socketIO = require('socket.io');
const http = require('http');

//Config File
require('./config/config');

//All routes
const app = require('./routes/index');
//using socketIO
let server = http.createServer(app);
let io = socketIO(server);
//Mongoose library
const mongoose = require('mongoose');

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true }, (err, res) => {
    console.log('Base de datos Lista');
});
server.listen(process.env.PORT, () => console.log(`A la escucha en el puerto ${process.env.PORT}`));