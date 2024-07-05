-- Your SQL goes here
DROP TABLE IF EXISTS grub_user;
DROP TABLE IF EXISTS grub;

CREATE TABLE grub (
    uuid VARCHAR(50) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    author INT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (author) REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE TABLE grub_user (
    id serial PRIMARY KEY,
    grub_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grub_id) REFERENCES grub(uuid),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);
