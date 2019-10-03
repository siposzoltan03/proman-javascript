from flask import Flask, render_template, url_for, request, jsonify, make_response, redirect, session
from util import json_response
import data_handler
import data_manager

app = Flask(__name__)
app.secret_key = b'sUpERrrDuPeRSeCRRrretKeYFoROUrProMaNpRoJecT'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('design.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_manager.get_table_data()


@app.route("/get-boards/<user_id>")
@json_response
def get_private_boards(user_id):
    return data_manager.get_user_table_data(user_id)


@app.route("/get-board/<board_id>")
def get_board(board_id):
    return data_manager.get_board_by_id(board_id)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_manager.get_cards_for_board(board_id)


@app.route("/get-statuses/<board_id>")
def get_statuses(board_id):
    return make_response(jsonify(data_manager.get_board_statuses(board_id)), 200)


@app.route('/add-board', methods=['POST'])
@json_response
def add_board():
    return data_manager.add_new_board()


@app.route('/add-private-board', methods=['POST'])
@json_response
def add_private_board():
    req = request.get_json()['data']
    user_id = req['user_id']
    print(user_id)
    return data_manager.add_new_private_board(user_id)


@app.route("/change-board-title", methods=['PUT'])
@json_response
def change_board_title():
    req = request.get_json()
    new_title = req["newTitle"]
    board_id = req["boardId"]
    data_manager.rename_board(board_id, new_title)
    return '', 204


@app.route("/change-board-status", methods=['PUT'])
@json_response
def change_board_status():
    req = request.get_json()
    board_id = req['id']
    status = req['status']
    data_manager.change_board_status(board_id, status)
    return '', 204


@app.route("/add-new-column", methods=['POST'])
@json_response
def add_new_column():
    req = request.get_json()
    board_id = req['id']
    new_title = req['newTitle']
    if new_title.lower() in data_manager.get_statuses().values():
        status_id = data_manager.get_status_id_by_title(new_title.lower())[0]['id']
        return data_manager.add_new_board_status(board_id, status_id)
    else:
        data_manager.add_new_status(new_title.lower())
        status_id = data_manager.get_status_id_by_title(new_title.lower())[0]['id']
        return data_manager.add_new_board_status(board_id, status_id)


@app.route("/card/<int:id>", methods=['PATCH'])
def patch_card(id):
    req = request.get_json()
    if 'title' in req['data']:
        data_manager.rename_card(id, req['data']['title'])
    elif 'statusId' in req['data']:
        data_manager.change_card_status(id, req['data']['statusId'])
    return '', 204


@app.route("/card/", methods=['POST'])
@json_response
def create_card():
    req = request.get_json()
    card_id = req['data']['boardId']
    status_id = req['data']['statusId']
    response = data_manager.add_new_card(card_id, status_id)
    return response


@app.route("/registration", methods=["POST"])
def registration():
    name = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]
    data_handler.reg_data(name, password, email)
    return redirect("/")


@app.route("/login", methods=["POST"])
def login():
    name = request.form["username"]
    password = request.form["password"]
    data_handler.login_user(name, password)
    return redirect("/")


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')


@app.route("/column/<int:boardId>", methods=['PATCH'])
def patch_column(boardId):
    board_id = boardId
    req = request.get_json()
    title = req['data']['newTitle']
    old_title = req['data']['oldTitle']
    old_status_id = data_manager.get_status_id_by_title(old_title.lower())[0]['id']
    if title.lower() in data_manager.get_statuses().values():
        status_id = data_manager.get_status_id_by_title(title.lower())[0]['id']
        data_manager.change_column_status(board_id, old_status_id, status_id)
    else:
        data_manager.add_new_status(title.lower())
        status_id = data_manager.get_status_id_by_title(title.lower())[0]['id']
        data_manager.change_column_status(board_id, old_status_id, status_id)


@app.route("/card/<card_id>", methods=['DELETE'])
def delete_card(card_id):
    data_manager.delete_card(card_id)
    return '', 204


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
