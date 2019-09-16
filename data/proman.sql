DROP TABLE IF EXISTS public.users CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial PRIMARY KEY,
    username text,
    password text
);
INSERT INTO users VALUES (1, 'admin', '$2b$12$YGebeEGSbyuGgyroX/CmJe5cbrnmC8fgtNJo4mqCQdfHKw9gySPDu');
SELECT pg_catalog.setval('users_id_seq', 1, true);


DROP TABLE IF EXISTS public.boards CASCADE;
DROP SEQUENCE IF EXISTS public.boards_id_seq;
CREATE TABLE boards (
    id serial PRIMARY KEY,
    title text
    -- user_id int REFERENCES users(id),
);
INSERT INTO boards VALUES (1, 'Board 1');
INSERT INTO boards VALUES (2, 'Board 2');
-- add user id after implementing login system!
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
    board_id int REFERENCES boards(id),
    title text,
    status_id int REFERENCES statuses(id),
    order_num int
);
INSERT INTO cards VALUES (1, 1, 'new card 1', 0, 0);
INSERT INTO cards VALUES (2, 1, 'new card 2', 0, 1);
INSERT INTO cards VALUES (3, 1, 'in progress card' ,1, 0);
INSERT INTO cards VALUES (4, 1, 'planning',2 ,0);
INSERT INTO cards VALUES (5, 1, 'done card 1', 3, 0);
INSERT INTO cards VALUES (6, 1, 'done card 1', 3, 1);
INSERT INTO cards VALUES (7, 2, 'new card 1', 0, 0);
INSERT INTO cards VALUES (8 ,2, 'new card 2', 0, 1);
INSERT INTO cards VALUES (9, 2, 'in progress card', 1, 0);
INSERT INTO cards VALUES (10, 2, 'planning', 2, 0);
INSERT INTO cards VALUES (11, 2, 'done card 1', 3, 0);
INSERT INTO cards VALUES (12, 2, 'done card 1', 3, 1);
SELECT pg_catalog.setval('cards_id_seq', 12, true);