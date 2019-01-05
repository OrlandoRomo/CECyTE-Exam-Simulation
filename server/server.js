//Config File
require('./config/config');

//All routes
const app = require('./routes/index');

//Mongoose library
const mongoose = require('mongoose');

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true }, (err, res) => {
    console.log('Base de datos Lista');
});

app.listen(process.env.PORT, () => console.log(`A la escucha en el puerto ${process.env.PORT}`));