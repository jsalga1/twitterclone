"use strict"

require('dotenv').config();
const getDB = require('./getConnection');

async function createDatabase() {
    let connection;

    try {
        connection = await getDB();
        console.log('Borrando tablas existentes...')
        
        await connection.query('DROP TABLE IF EXISTS repost');
        await connection.query('DROP TABLE IF EXISTS mentions');
        await connection.query('DROP TABLE IF EXISTS replies');
        await connection.query('DROP TABLE IF EXISTS posts');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(`
        CREATE TABLE users (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(150) NOT NULL,
            username VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            bio VARCHAR(500),
            img VARCHAR(150),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
            )
        `);
        
        await connection.query(`
        CREATE TABLE posts (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id INT UNSIGNED NOT NULL,
            text VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);
        
        await connection.query(`
        CREATE TABLE mentions (
            post_id INT UNSIGNED NOT NULL,
            mentioned_user_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (post_id, mentioned_user_id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (mentioned_user_id) REFERENCES users (id)
            )    
        `);

        await connection.query(`
        CREATE TABLE repost (
            original_post_id INT UNSIGNED NOT NULL,
            reposter_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (original_post_id, reposter_id),
            FOREIGN KEY (original_post_id) REFERENCES posts (id),
            FOREIGN KEY (reposter_id) REFERENCES users (id)
            )
        `);
        
        await connection.query(`
        CREATE TABLE replies (
            post_id INT UNSIGNED NOT NULL,
            replied_to_post_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (post_id, replied_to_post_id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (replied_to_post_id) REFERENCES posts (id)
            )
        `)
    } catch (error) {
        console.error(error)
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

createDatabase();
