// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs
import {dom} from "./dom.js";

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data
            })
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                callback(res)
            })

    },
    _api_patch: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data
            })
        })
            .then((res) => {
                callback(res)
            });

    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getNewBoard: function (callback) {
        // the board is retrieved and then the callback function is called with the board
        this._api_post('/add-board', '',(response) => {
            this._data = response;
            callback(response)
        });
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('get-statuses', callback);
    },

    retStatuses: function (statuses) {
        return statuses;
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getStatusByBoard: function(boardId, callback){
      dataHandler._api_get(`/get-statuses/${boardId}`, callback)
    },
    getCardsByBoardId: function (boardId, callback) {
        this._api_get(`/get-cards/${boardId}`, callback)
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/add-board', '', callback)
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data

    },
    // here comes more features
    submitNewTitle: function (event) {
        let header = event.currentTarget.parentElement;
        let newTitle = header.querySelector(".new-board-title");
        if (newTitle.value === '') {
            newTitle.value = newTitle.getAttribute("value");
        }
        let saveButton = header.querySelector(".title-save-button");
        header.removeChild(newTitle);
        header.removeChild(saveButton);
        const boardTitle = document.createElement('span');
        boardTitle.classList.add('board-title');
        boardTitle.textContent = newTitle.value;
        header.prepend(boardTitle);
        let unslicedBoardId = header.parentElement.id;
        let boardId = unslicedBoardId.replace("board-", "");

        let titleAndId = {
            newTitle: newTitle.value,
            boardId: boardId
        };
        dom.renameBoard();
        fetch(`${window.origin}/change-board-title`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(titleAndId),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
    },
    createBoardStatusRequest: function(req){
        fetch(`${window.origin}/change-board-status`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(req),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
    },

    addColumn: function () {
        const columnName = document.querySelector('#col-name').value;
        let boardId = document.querySelector('#board-id').value;
        document.querySelector('#col-name').value = '';
        let idAndTitle = {
            id: boardId,
            newTitle: columnName
        };
        fetch(`${window.origin}/add-new-column`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(idAndTitle),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
            .then(response =>
                response.json()
            )
            .then(json_response => {
                let board = document.querySelector(`#board-${boardId}`);
                let boardColumns = board.querySelector('.board-columns');
                dom.addStatus(json_response, board, boardColumns);
            });
    },

    updateCardTitle: function(id, title, callback) {
        this._api_patch(`${window.origin}/card/${id}`, {title}, callback);
    },

    updateCardStatus: function(id, statusId, callback) {
        this._api_patch(`${window.origin}/card/${id}`, {statusId}, callback);
    },

    updateColumnTitle(boardId,newTitle, oldTitle, callback) {
        this._api_patch(`${window.origin}/column/${boardId}`, {newTitle, oldTitle}, callback);
    }

};
