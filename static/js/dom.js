// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

var display = {}

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
        let buttonAddBoard = document.querySelector('.board-add');
        buttonAddBoard.addEventListener('click', dom.loadNewBoard)
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        //let boardContainer = document.querySelector('.board-container');
        //boardContainer.innerHTML = '';
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardContainer = document.querySelector('.board-container');


        for (let board of boards) {
            let section = document.createElement('section');
            section.classList.add('board');
            section.setAttribute('id', 'board-' + board.id);
            boardContainer.appendChild(section);

            this.createBoardHeader(board);
            dataHandler.getStatusByBoard(board.id, dom.createBoardColumns);
        }


    },
    showCards: function (cards) {
        for (let card of cards) {
            let board = document.querySelector(`#board-${card["board_id"]}`);
            let status = board.querySelector(`.column-${card["status_id"]}`);
            let content = status.querySelector('.board-column-content');
            let newCard = document.createElement('div');
            newCard.setAttribute('class', 'card');
            let deleteButton = document.createElement('div');
            deleteButton.setAttribute('class', 'card-remove');
            let trashIcon = document.createElement('i');
            trashIcon.classList.add('fas');
            trashIcon.classList.add('fa-trash-alt');
            deleteButton.appendChild(trashIcon);
            newCard.appendChild(deleteButton);
            let cardTitle = document.createElement('div');
            cardTitle.setAttribute('class', 'card-title');
            cardTitle.textContent = card["title"];
            cardTitle.setAttribute('data-id', card["id"]);
            newCard.appendChild(cardTitle);
            content.appendChild(newCard);

        }
    },
    loadCards: function (boardId) {
        dataHandler.getCardsByBoardId(boardId, dom.showCards);
    },
    getBoardIdsFromDocument: function (boardId) {
        let rawBoardId = document.querySelector(`#board-${boardId}`);
        rawBoardId.id.replace('board-', '');
        dom.loadCards(boardId)


    },
    createBoardHeader: function (boardRow) {
        display[boardRow.id] = boardRow.is_active
        let section = document.querySelector('#board-' + boardRow.id);
        let boardHeader = document.createElement('div');
        boardHeader.classList.add('board-header');
        let boardTitle = document.createElement('span');
        boardTitle.classList.add('board-title');
        boardTitle.textContent = boardRow.title;
        let buttonAddCard = document.createElement('button');
        buttonAddCard.classList.add('board-add');
        buttonAddCard.textContent = 'Add Card';
        let buttonAddColumn = document.createElement("button");
        buttonAddColumn.classList.add('column-add');
        buttonAddColumn.textContent = 'Add Column';
        let buttonToggleBoard = document.createElement('button');
        buttonToggleBoard.classList.add('board-toggle');
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-chevron-down');
        if (boardRow.is_active) {
            icon.addEventListener('click', dom.hideBoard);
        } else {
            icon.addEventListener('click', dom.displayBoard);
        }
        section.appendChild(boardHeader);
        boardHeader.appendChild(boardTitle);
        boardHeader.appendChild(buttonAddCard);
        boardHeader.appendChild(buttonToggleBoard);
        boardHeader.appendChild(buttonAddColumn)
        buttonToggleBoard.appendChild(icon);
        //rename boards and add new columns
        dom.renameBoard();
        dom.addNewColumn();
    },

    createBoardColumns(statuses) {
        let board = document.querySelector(`#board-${statuses.id}`);

        let boardId = board.id.replace('board-', '');
        let boardColumns = document.createElement('div');
        boardColumns.classList.add('board-columns');
        if (display[boardId] === false) {
            boardColumns.classList.add('hidden');
        }
        for (let status in statuses) {
            if (status !== 'id') {
                let boardColumn = document.createElement('div');
                boardColumn.setAttribute('class', 'column-' + status);
                boardColumn.classList.add('board-column');
                let boardColumnTitle = document.createElement('div');
                boardColumnTitle.classList.add('board-column-title');
                boardColumnTitle.textContent = statuses[status];
                let boardColumnContent = document.createElement("div");
                boardColumnContent.classList.add('board-column-content');
                board.appendChild(boardColumns);
                boardColumns.appendChild(boardColumn);
                boardColumn.appendChild(boardColumnTitle);
                boardColumn.appendChild(boardColumnContent);

            }
        }
        dom.loadCards(statuses.id)
    },
    renameBoard: function () {
        let boardTitle = document.querySelectorAll('.board-title');
        for (let title of boardTitle) {
            title.addEventListener('dblclick', function (event) {
                let original = event.currentTarget;
                event.currentTarget.outerHTML = `<input type="text" class="new-board-title" value="${original.textContent}" size="15" required minlength="1" >
                    <button class="title-save-button">Save</button>`;
                let saveButton = document.querySelector('.title-save-button');
                saveButton.addEventListener('click', dataHandler.submitNewTitle);
            });
        }
    },
    hideBoard: function (event) {
        let target = event.currentTarget;
        target.removeEventListener('click', dom.hideBoard);
        target.addEventListener('click', dom.displayBoard);
        let board = target.parentElement.parentElement.parentElement;
        board.querySelector('.board-columns').classList.add('hidden');
        let boardId = board.id.replace('board-', '');
        let request = {id: boardId, status: false};
        dataHandler.createBoardStatusRequest(request);
    },
    displayBoard: function (event) {
        let target = event.target;
        target.removeEventListener('click', dom.displayBoard);
        target.addEventListener('click', dom.hideBoard);
        let board = target.parentElement.parentElement.parentElement;
        board.querySelector('.board-columns').classList.remove('hidden');
        let boardId = board.id.replace('board-', '');
        let request = {id: boardId, status: true};
        dataHandler.createBoardStatusRequest(request);
    },
    loadNewBoard: function () {
        dataHandler.getNewBoard(function (boards) {
            dom.showBoards(boards);
        });
    },
    addNewColumn: function(event){
        let addColumnButtons = document.querySelectorAll('.column-add')
        for (let addColumnButton of addColumnButtons) {
            addColumnButton.addEventListener('click', dataHandler.addColumn)
        }

    },
};
