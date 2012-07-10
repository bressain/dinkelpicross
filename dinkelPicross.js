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

        function initializeBoard() {
            var board = new Array(solution.length);

            for (var i = 0; i < board.length; i++)
                board[i] = new Array(solution.length);

            return board;
        }
    };
}());