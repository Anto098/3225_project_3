DROP TABLE IF EXISTS users;
CREATE TABLE users(
    email varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    username varchar(30) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    games_played int(11) NOT NULL DEFAULT 0,
    score int(11) NOT NULL DEFAULT 0,
    CONSTRAINT games_played_ge_zero CHECK (games_played >= 0),
    CONSTRAINT score_ge_zero CHECK (score >= 0)
);

INSERT INTO users(email,username,password) VALUES
("test@test.com","test",SHA1("password"));