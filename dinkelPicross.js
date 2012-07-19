/// <reference path="lib/underscore.js" />
"use strict";

window.DinkelPicross = {};

(function () {
    DinkelPicross.Board = function (solutionArray) {
        var solution = solutionArray,
            board = initializeBoard(),
            errorLocations = [];

        this.width = solution[0].length;
        this.height = solution.length;
        this.errors = 0;

        this.getCell = function (x, y) {
            return board[x][y];
        };

        this.setCellFull = function (x, y) {
            if (this.isErrorCell(x, y))
                return;

            if (board[x][y] === 0) {
                this.setCellMarked(x, y);
                return;
            }

            if (!solution[x][y]) {
                this.setCellMarked(x, y);
                this.errors++;
                errorLocations.push({ x: x, y: y });
                throw new Error("Does not match solution");
            }

            board[x][y] = 1;
        };

        this.setCellMarked = function (x, y) {
            if (board[x][y] || this.isErrorCell(x, y))
                return;

            board[x][y] = board[x][y] !== 0 ? 0 : undefined;
        };

        this.isErrorCell = function (x, y) {
            return _.any(errorLocations, function (loc) {
                return loc.x === x && loc.y === y;
            });
        };

        this.boardCompleted = function () {
            for (var i = 0; i < solution.length; i++) {
                for (var j = 0; j < solution.length; j++) {
                    if (solution[i][j] === 1 && board[i][j] !== 1) {
                        return false;
                    }
                }
            }
            return true;
        };

        function initializeBoard() {
            var board = new Array(solution.length);

            for (var i = 0; i < board.length; i++)
                board[i] = new Array(solution.length);

            return board;
        }
    };

    DinkelPicross.createBuildUi = function (board, boardEl) {
        for (var i = 0; i < board.height; i++) {
            for (var j = 0; j < board.width; j++) {
                boardEl.append($("<div>", { id: i + "_" + j, class: "cell" }));
            }
            boardEl.append($("<div>", { style: "clear: both" }));
        }

        $(".cell").click(function (e) {
            var point = parseCellId(this);

            try {
                board.setCellFull(point.x, point.y);
            } catch (e) { /* don't care about this yet */ }

            setCellClass(this, point.x, point.y);
        });

        $(".cell").bind("contextmenu", function (e) {
            var point = parseCellId(this);

            board.setCellMarked(point.x, point.y);

            setCellClass(this, point.x, point.y);

            return false;
        });

        function parseCellId(cellElement) {
            return {
                x: new Number($(cellElement).attr("id").charAt(0)),
                y: new Number($(cellElement).attr("id").charAt(2))
            };
        }

        function setCellClass(cellElement, x, y) {
            var state = board.getCell(x, y);

            $(cellElement).removeClass("marked");
            if (state == 0) {
                if (board.isErrorCell(x, y)) {
                    $(cellElement).addClass("error");
                } else {
                    $(cellElement).addClass("marked");
                }
            } else if (state == 1) {
                $(cellElement).addClass("full");
            }
        }
    };
}());