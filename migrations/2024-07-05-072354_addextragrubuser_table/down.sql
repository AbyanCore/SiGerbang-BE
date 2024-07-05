-- This file should undo anything in `up.sql`

DROP TABLE IF EXISTS grub_user;
DROP TYPE IF EXISTS USER_ROLE;

CREATE TABLE grub_user (
    id serial PRIMARY KEY,
    grub_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grub_id) REFERENCES grub(uuid),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);
