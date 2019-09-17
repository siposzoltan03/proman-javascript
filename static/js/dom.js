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
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let statuses = dataHandler.getStatuses(dataHandler.retStatuses);
        console.log(statuses);
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
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    createBoardHeader: function (boardRow) {
        let section = document.querySelector('#board-' + boardRow.id);
        let boardHeader = document.createElement('div');
        boardHeader.classList.add('board-header');
        let boardTitle = document.createElement('span');
        boardTitle.classList.add('board-title');
        boardTitle.textContent = boardRow.title;
        let buttonAddBoard = document.createElement('button');
        buttonAddBoard.classList.add('board-add');
        buttonAddBoard.textContent = 'Add Card';
        let buttonToggleBoard = document.createElement('button');
        buttonToggleBoard.classList.add('board-toggle');
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-chevron-down');
        section.appendChild(boardHeader);
        boardHeader.appendChild(boardTitle);
        boardHeader.appendChild(buttonAddBoard);
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
                boardColumn.classList.add('board-column');
                boardColumn.setAttribute('class', 'column-' + status);
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


    }

};
