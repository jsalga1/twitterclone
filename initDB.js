    const mysql = require("mysql");

    const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456abc",
    database: "clon",
    });

    connection.connect((err) => {
    if (err) {
        throw err;
    }

    // Create the users table
    connection.query(
        `CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        PRIMARY KEY (id)
        )`,
        (err) => {
        if (err) {
            throw err;
        }

        // Create the posts table
        connection.query(
            `CREATE TABLE posts (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            text VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
            )`,
            (err) => {
            if (err) {
                throw err;
            }

            // Create the mentions table
            connection.query(
                `CREATE TABLE mentions (
                post_id INT NOT NULL,
                mentioned_user_id INT NOT NULL,
                PRIMARY KEY (post_id, mentioned_user_id),
                FOREIGN KEY (post_id) REFERENCES posts (id),
                FOREIGN KEY (mentioned_user_id) REFERENCES users (id)
                )`,
                (err) => {
                if (err) {
                    throw err;
                }

                // Create the reposts table
                connection.query(
                    `CREATE TABLE reposts (
                    original_post_id INT NOT NULL,
                    reposter_id INT NOT NULL,
                    PRIMARY KEY (original_post_id, reposter_id),
                    FOREIGN KEY (original_post_id) REFERENCES posts (id),
                    FOREIGN KEY (reposter_id) REFERENCES users (id)
                    )`,
                    (err) => {
                    if (err) {
                        throw err;
                    }

                    // Create the replies table
                    connection.query(
                        `CREATE TABLE replies (
                        post_id INT NOT NULL,
                        replied_to_post_id INT NOT NULL,
                        PRIMARY KEY (post_id, replied_to_post_id),
                        FOREIGN KEY (post_id) REFERENCES posts (id),
                        FOREIGN KEY (replied_to_post_id) REFERENCES posts (id)
                        )`,
                        (err) => {
                        if (err) {
                            throw err;
                        }

                        // Connection is ready
                        connection.end();
                        },
                    );
                    },
                );
                },
            );
            },
        );
        },
    );
    });
