from flask import Flask, render_template, url_for, request, jsonify, make_response
from util import json_response


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


@app.route("/get-statuses")  # /<board_id>
@json_response
def get_statuses():  # (board_id)
    #  data_manager.get_board_statuses(board_id)
    return data_manager.get_statuses()


@app.route('/add-board', methods=['POST'])
def add_board():
    if request.method == 'POST':
        # next_board_num = str(data_manager.get_next_board_name())
        response = make_response(jsonify(data_manager.add_new_board()))
        return response


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
    print(req)
    board_id = req['id']
    new_title = req['newTitle']
    if new_title.lower() in data_manager.get_statuses().values():
        status_id = data_manager.get_status_id_by_title(new_title.lower())[0]['id']
        print(status_id)
        data_manager.add_new_board_status(board_id, status_id)
    else:
        data_manager.add_new_status(new_title.lower())
        status_id = data_manager.get_status_id_by_title(new_title.lower())[0]['id']
        print(status_id)
        data_manager.add_new_board_status(board_id, status_id)

    return '', 204


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
