"use strict"

const { createUser } = require('./Controllers/Users/createUser');
const app = express();
const cors = require('cors');

app.post('./createUsers', createUser);
app.use(cors({
    origin: 'http://localhost:3000',
}));


// Middleware de errores
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
});
});

// Middleware de ruta no encontrada
app.use((req, res, next) => {
    res.status(404).send({
    status: 'error',
    message: 'La ruta solicitada no existe.',
});
});


module.exports = app;
