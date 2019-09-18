from psycopg2 import sql
import bcrypt
import connection


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


@connection.connection_handler
def get_table_data(cursor, table):  # _read_csv(file)
    cursor.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table)))
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
                      WHERE board_id = %s""", (board_id,))
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
def add_new_board(cursor):
    cursor.execute("""INSERT INTO boards (title)
                      VALUES ('New board')""")


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

