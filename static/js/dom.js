// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

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
        buttonAddBoard.addEventListener('click', function(){

            dataHandler.createNewBoard(dom.loadBoards)
        })
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        let boardContainer = document.querySelector('.board-container');
        boardContainer.innerHTML = '';
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

        }
        dataHandler.getStatuses(this.createBoardColumns);

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
        dataHandler.getCardsByBoardId(boardId, this.showCards);
    },
    getBoardIdsFromDocument: function () {
        let boardIds = document.querySelectorAll('.board');
        for (let rawBoardId of boardIds) {
            let boardId = rawBoardId.id.replace('board-', '');
            this.loadCards(boardId)
        }

    },
    createBoardHeader: function (boardRow) {
        let section = document.querySelector('#board-' + boardRow.id);
        let boardHeader = document.createElement('div');
        boardHeader.classList.add('board-header');
        let boardTitle = document.createElement('span');
        boardTitle.classList.add('board-title');
        boardTitle.textContent = boardRow.title;
        let buttonAddCard = document.createElement('button');
        buttonAddCard.classList.add('board-add');
        buttonAddCard.textContent = 'Add Card';
        let buttonToggleBoard = document.createElement('button');
        buttonToggleBoard.classList.add('board-toggle');
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-chevron-down');
        section.appendChild(boardHeader);
        boardHeader.appendChild(boardTitle);
        boardHeader.appendChild(buttonAddCard);
        boardHeader.appendChild(buttonToggleBoard);
        buttonToggleBoard.appendChild(icon);
    },

    createBoardColumns(statuses) {
        let boards = document.querySelectorAll('.board');
        for (let board of boards) {
            let boardColumns = document.createElement('div');
            boardColumns.classList.add('board-columns');
            for (let status in statuses) {
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
        dom.getBoardIdsFromDocument();
    }
};
