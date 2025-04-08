const USER_TABLE = `
    CREATE TABLE IF NOT EXISTS users (
                                         id INT NOT NULL AUTO_INCREMENT,
                                         name VARCHAR(255) NOT NULL,
                                         PRIMARY KEY (id)
    );
`

const TWEET_TABLE = `
    CREATE TABLE IF NOT EXISTS tweets (
                                          id INT NOT NULL AUTO_INCREMENT,
                                          user_id INT NOT NULL,
                                          content VARCHAR(255) NOT NULL,
                                          PRIMARY KEY (id),
                                          FOREIGN KEY (user_id) REFERENCES users(id)
    );
`

const COMMENT_TABLE = `
    CREATE TABLE IF NOT EXISTS comments (
                                            id INT NOT NULL AUTO_INCREMENT,
                                            user_id INT NOT NULL,
                                            tweet_id INT NOT NULL,
                                            content VARCHAR(255) NOT NULL,
                                            PRIMARY KEY (id),
                                            FOREIGN KEY (user_id) REFERENCES users(id),
                                            FOREIGN KEY (tweet_id) REFERENCES tweets(id)
    );
`

const LIKE_TABLE = `
    CREATE TABLE IF NOT EXISTS likes (
                                         id INT NOT NULL AUTO_INCREMENT,
                                         user_id INT NOT NULL,
                                         tweet_id INT NOT NULL,
                                         PRIMARY KEY (id),
                                         FOREIGN KEY (user_id) REFERENCES users(id),
                                         FOREIGN KEY (tweet_id) REFERENCES tweets(id)
    );
`

const NOTIFICATION_TABLE = `
    CREATE TABLE IF NOT EXISTS notifications (
                                                 id INT NOT NULL AUTO_INCREMENT,
                                                 user_id INT NOT NULL,
                                                 message VARCHAR(255) NOT NULL,
                                                 read_status BOOLEAN NOT NULL DEFAULT 0,
                                                 PRIMARY KEY (id),
                                                 FOREIGN KEY (user_id) REFERENCES users(id)
    );
`

export { USER_TABLE, TWEET_TABLE, COMMENT_TABLE, LIKE_TABLE, NOTIFICATION_TABLE }
