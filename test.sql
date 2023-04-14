
DROP DATABASE IF EXISTS messagely_test
CREATE DATABASE messagely_test
\c messagely_test

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


-- INSERT INTO users
--   VALUES ('BobBrown', '1234', 'Bob', 'Brown', '123-353-2553', current_timestamp);


-- INSERT INTO messages (from_username, to_username, body, sent_at)
--   VALUES ('Elie', 'BobBrown', 'hi', current_timestamp);


-- SELECT m.id, m.to_username, m.body, m.sent_at, m.read_at
-- FROM messages AS m
-- JOIN users as u ON m.from_username = u.username
-- WHERE m.from_username = 'Elie';
