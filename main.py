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
    print(data_manager.get_cards_for_board('1'))
    return render_template('design.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_manager.get_table_data('boards')


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


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_manager.get_statuses()


@app.route('/add-board', methods=['POST'])
def add_board():
    if request.method == 'POST':
        # next_board_num = str(data_manager.get_next_board_name())
        response = make_response(jsonify(data_manager.add_new_board()))
        return response


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
