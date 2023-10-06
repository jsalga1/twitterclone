'use strict';

const getDB = require('../../BBDD/getConnection');
const { generateError } = require('../helpers');

const createUser = async (req, res, next) => {
let connection;

try {
    connection = await getDB();

    const { email, password } = req.body;

    if (!email || !password) {
    generateError('Faltan campos', 400);
    }

    const [existingUser] = await connection.query(
    
        `SELECT id, created_at
        FROM users
        WHERE email = ?`
    ,
    [email]
    );

    if (existingUser.length > 0) {
    generateError("Ya existe un usuario con este email, 409");
    }

    await connection.query(
    
        `INSERT INTO users (email, password )
        VALUES (?, SHA2(?, 512))`
    ,
    [email, password]
    );

    res.status(201).send({
    status: 'ok',
    message: 'Usuario creado',
    });
} catch (error) {
    next(error);
} finally {
    if (connection) connection.release();
}
};

module.exports = createUser;