-- Your SQL goes here

DROP TABLE IF EXISTS grub_user;

CREATE TYPE USER_ROLE AS ENUM('admin', 'member');

CREATE TABLE grub_user (
    id serial PRIMARY KEY,
    grub_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    user_role USER_ROLE NOT NULL DEFAULT 'member',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grub_id) REFERENCES grub(uuid),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);
