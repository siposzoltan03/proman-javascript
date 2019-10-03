from psycopg2 import sql
import connection
from util import hash_password as hash, verify_password as verify


@connection.connection_handler
def get_table_data(cursor):  # _read_csv(file)
    cursor.execute("SELECT * FROM boards ORDER BY id")
    return cursor.fetchall()


@connection.connection_handler
def get_card_status(cursor, status_id):
    cursor.execute("""SELECT title FROM statuses
                      WHERE id = %s""", (status_id,))
    status = cursor.fetchone()
    return status['title'] if status else 'unknown'


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""SELECT * FROM cards
                      WHERE board_id = %s
                      ORDER BY order_num""", (board_id,))
    return cursor.fetchall()


@connection.connection_handler
def rename_board(cursor, board_id, new_name):
    cursor.execute("""UPDATE boards
                      SET title = %s
                      WHERE id = %s""", (new_name, board_id))


@connection.connection_handler
def rename_card(cursor, card_id, new_name):
    cursor.execute("""UPDATE cards
                      SET title = %s
                      WHERE id = %s""", (new_name, card_id))


@connection.connection_handler
def change_card_status(cursor, card_id, status_id):
    cursor.execute("""UPDATE cards
                      SET status_id = %s
                      WHERE id = %s""", (status_id, card_id))


@connection.connection_handler
def add_new_board(cursor):
    cursor.execute("""
                  SELECT max(id) as max_id
                  FROM boards
                  """)
    max_id = int(cursor.fetchone()['max_id']) + 1

    cursor.execute("""INSERT INTO boards (title)
                      VALUES ('Board ' || %s)
                      RETURNING id""", (max_id,))
    _id = cursor.fetchone()
    board_id = _id['id']
    cursor.execute("""SELECT * FROM boards
                      WHERE id = %s""", (board_id,))
    return cursor.fetchall()


@connection.connection_handler
def add_new_card(cursor, board_id):
    cursor.execute("""SELECT COALESCE(MAX(order_num) + 1, 0)AS next FROM cards
                              WHERE board_id = %s
                              AND status_id = 0""", (board_id,))
    order_num = cursor.fetchone()["next"]

    cursor.execute("""INSERT INTO cards (board_id, title, status_id, order_num)
                      VALUES (%s, 'New card', 0, %s)""", (board_id, order_num))


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute("""
                   SELECT *
                   FROM statuses
                   """)
    statuses_data = cursor.fetchall()
    statuses = {}
    for element in statuses_data:
        statuses[element['id']] = element['title']
    return statuses


@connection.connection_handler
def get_next_board_name(cursor):
    cursor.execute("""
                  SELECT title
                  FROM boards
                  """)
    boards = cursor.fetchall()
    board_numbers = []
    for board_title in boards:
        board_numbers.append(int(board_title['title'][-1]))
    return max(board_numbers) + 1


@connection.connection_handler
def get_board_by_id(cursor, board_id):
    cursor.execute("""
                   SELECT *
                   FROM boards
                   WHERE id = %s
                   """, board_id)
    board = cursor.fetchall()
    return board


@connection.connection_handler
def change_board_status(cursor, board_id, status):
    cursor.execute("""UPDATE boards
                      SET is_active = %s
                      WHERE id = %s""", (status, board_id))


@connection.connection_handler
def get_board_statuses(cursor, board_id):
    cursor.execute("""SELECT s.id, title FROM statuses s
                      INNER JOIN board_statuses bs ON
                      s.id = bs.status_id
                      WHERE bs.board_id = %s""", (board_id,))
    statuses_data = cursor.fetchall()
    statuses = {}
    for element in statuses_data:
        statuses[str(element['id'])] = element['title']
    statuses['id'] = str(board_id)
    return statuses


@connection.connection_handler
def get_status_id_by_title(cursor, status_title):
    cursor.execute("""
                   SELECT id
                   FROM statuses
                   WHERE title = %s
                   """, (status_title,))
    status_id = cursor.fetchall()
    return status_id


@connection.connection_handler
def add_new_board_status(cursor, board_id, status_id):
    cursor.execute("""
                      SELECT max(id) as max_id
                      FROM board_statuses
                      """)
    max_id = int(cursor.fetchone()['max_id']) + 1

    cursor.execute("""
                   INSERT INTO board_statuses (board_id, status_id )
                   VALUES (%s, %s)
                   """, (board_id, status_id))
    cursor.execute("""
                   SELECT statuses.id, statuses.title
                   FROM  statuses
                   JOIN board_statuses
                    ON statuses.id = board_statuses.status_id
                    WHERE board_statuses.id = %s
                   """, (max_id,))
    last_status = cursor.fetchone()
    response = {str(last_status['id']): last_status['title'], 'id': board_id}
    return response


@connection.connection_handler
def add_new_status(cursor, status):
    cursor.execute("""
                      SELECT max(id) as max_id
                      FROM statuses
                      """)
    max_id = int(cursor.fetchone()['max_id']) + 1

    cursor.execute("""
                   INSERT INTO statuses (title)
                   VALUES (%s)
                   """, (status,))


@connection.connection_handler
def registration(cursor, user):
    cursor.execute("""
                            INSERT INTO users (registration_time, username, email, password)
                            VALUES (%s,%s,%s,%s)
                            """,
                    (user['registration_time'],
                    user['username'],
                    user['email'],
                    user['password'],
                    )
                   )


@connection.connection_handler
def get_hashed_password(cursor, user):
    cursor.execute("""
                        SELECT password
                        FROM users
                        WHERE username = %s;
                        """,
                   (user['username'],)
                   )
    return cursor.fetchall()


@connection.connection_handler
def get_user_data(cursor, user):
    cursor.execute("""
                        SELECT *
                        FROM users
                        WHERE username = %s;
                       """,
                   (user['username'],
                    )
                   )
    return cursor.fetchall()


@connection.connection_handler
def user_name_and_email_available(cursor, name, email):
    cursor.execute("""
                    SELECT *
                    FROM users
                    WHERE email = %s OR username = %s;
                    """,
                   (email, name))
    users = cursor.fetchall()
    return False if users else True