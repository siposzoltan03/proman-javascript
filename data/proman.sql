DROP TABLE IF EXISTS public.users CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    registration_time timestamp without time zone,
    username text UNIQUE,
    email text UNIQUE,
    password text
);
INSERT INTO users VALUES (1, '2017-04-28 08:29:00', 'admin', 'admin@admin.admin', '$2b$12$NvGn0FaCGzdAgTbSe7zu7eRY2CgkpV3bCEIzqhZ2837cTk3M1ewqm');
INSERT INTO users VALUES (2, '2017-04-28 08:29:00', 'testuser', 'user@user.user', '$2b$12$RCY1YqCG7E1mRwXYy58Ux.LDK7202QWhSgnHZexd2SacOJnGRqdCm');
SELECT pg_catalog.setval('users_id_seq', 2, true);


DROP TABLE IF EXISTS public.boards CASCADE;
DROP SEQUENCE IF EXISTS public.boards_id_seq;
CREATE TABLE boards (
    id serial PRIMARY KEY,
    title text,
    is_active bool DEFAULT TRUE,
    user_id int REFERENCES users(id)
);
INSERT INTO boards VALUES (1, 'Public 1', TRUE);
INSERT INTO boards VALUES (2, 'Private 1', FALSE, 1);
SELECT pg_catalog.setval('boards_id_seq', 2, true);


DROP TABLE IF EXISTS public.statuses CASCADE;
DROP SEQUENCE IF EXISTS public.statuses_id_seq;
CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    title text
);
INSERT INTO statuses VALUES (0, 'new');
INSERT INTO statuses VALUES (1, 'in progress');
INSERT INTO statuses VALUES (2, 'testing');
INSERT INTO statuses VALUES (3, 'done');
SELECT pg_catalog.setval('statuses_id_seq', 3, true);


DROP TABLE IF EXISTS public.cards CASCADE;
DROP SEQUENCE IF EXISTS public.cards_id_seq;
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    board_id int REFERENCES boards(id) ON DELETE CASCADE,
    title text,
    status_id int REFERENCES statuses(id),
    order_num int
);
INSERT INTO cards VALUES (1, 1, 'new card 1', 0, 0);
INSERT INTO cards VALUES (2, 1, 'new card 2', 0, 1);
INSERT INTO cards VALUES (3, 1, 'in progress card' ,1, 0);
INSERT INTO cards VALUES (4, 1, 'planning',2 ,0);
INSERT INTO cards VALUES (5, 1, 'done card 1', 3, 0);
INSERT INTO cards VALUES (6, 1, 'done card 2', 3, 1);
INSERT INTO cards VALUES (7, 2, 'new card 1', 0, 0);
INSERT INTO cards VALUES (8 ,2, 'new card 2', 0, 1);
INSERT INTO cards VALUES (9, 2, 'in progress card', 1, 0);
INSERT INTO cards VALUES (10, 2, 'planning', 2, 0);
INSERT INTO cards VALUES (11, 2, 'done card 1', 3, 0);
INSERT INTO cards VALUES (12, 2, 'done card 2', 3, 1);
SELECT pg_catalog.setval('cards_id_seq', 12, true);

DROP TABLE IF EXISTS public.board_statuses CASCADE;
DROP SEQUENCE IF EXISTS public.board_statuses_id_seq;
CREATE TABLE board_statuses
(
    id        SERIAL PRIMARY KEY,
    board_id  int REFERENCES boards (id) ON DELETE CASCADE,
    status_id int REFERENCES statuses (id)
);
INSERT INTO board_statuses VALUES (1, 1, 0);
INSERT INTO board_statuses VALUES (2, 1, 1);
INSERT INTO board_statuses VALUES (3, 1, 2);
INSERT INTO board_statuses VALUES (4, 1, 3);
INSERT INTO board_statuses VALUES (5, 2, 0);
INSERT INTO board_statuses VALUES (6, 2, 1);
INSERT INTO board_statuses VALUES (7, 2, 2);
INSERT INTO board_statuses VALUES (8, 2, 3);
SELECT pg_catalog.setval('board_statuses_id_seq', 8, true);

CREATE OR REPLACE FUNCTION default_statuses()
  RETURNS trigger AS $default_statuses$
BEGIN
   INSERT INTO board_statuses(board_id, status_id) VALUES(new.id, 0);
   INSERT INTO board_statuses(board_id, status_id) VALUES(new.id, 1);
   INSERT INTO board_statuses(board_id, status_id) VALUES(new.id, 2);
   INSERT INTO board_statuses(board_id, status_id) VALUES(new.id, 3);
   RETURN NEW;
END;
$default_statuses$ LANGUAGE plpgsql;

CREATE TRIGGER add_statuses
    AFTER INSERT
    ON boards
    FOR EACH ROW
    EXECUTE PROCEDURE  default_statuses();