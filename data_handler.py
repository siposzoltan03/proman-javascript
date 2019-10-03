from flask import session

import persistence
import util
import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def reg_data(name, password, email):
    if data_manager.user_name_and_email_available(name, email):
        user = {}
        user['registration_time'] = util.get_current_datetime()
        user['username'] = name
        user['email'] = email
        user['password'] = util.hash_password(password)
        data_manager.registration(user)


def login_user(username, password):
    user = {}
    user['username'] = username
    user['password'] = password
    hashed_password = data_manager.get_hashed_password(user)
    if util.verify_password(password,hashed_password[0]['password']):
        user_all_data = data_manager.get_user_data(user)
        session['user'] = user_all_data[0]['username']
        session['user_id'] = user_all_data[0]['id']
