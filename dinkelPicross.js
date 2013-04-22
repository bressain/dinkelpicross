/// <reference path="lib/underscore.js" />
"use strict";

var DinkelPicross = window.DinkelPicross || {};

DinkelPicross.Board = function (solutionArray) {
    var solution = solutionArray,
        board = initializeBoard(),
        errorLocations = [],
        FULL_CELL = 1,
        MARKED_CELL = 0;

    this.width = solution[0].length;
    this.height = solution.length;
    this.errors = 0;

    this.getCell = function (x, y) {
        return board[x][y];
    };

    this.setCellFull = function (x, y) {
        if (this.isErrorCell(x, y)) return;

        if (board[x][y] === MARKED_CELL) {
            this.toggleCellMarked(x, y);
            return;
        }

        if (!solution[x][y]) {
            this.toggleCellMarked(x, y);
            this.errors++;
            errorLocations.push({ x: x, y: y });
            throw new Error("Does not match solution");
        }

        board[x][y] = FULL_CELL;
    };

    this.toggleCellMarked = function (x, y) {
        if (board[x][y] || this.isErrorCell(x, y))
            return;

        board[x][y] = board[x][y] !== MARKED_CELL ? MARKED_CELL : undefined;
    };

    this.isErrorCell = function (x, y) {
        return _.any(errorLocations, function (loc) {
            return loc.x === x && loc.y === y;
        });
    };

    this.boardCompleted = function () {
        for (var i = 0; i < solution.length; i++) {
            for (var j = 0; j < solution.length; j++) {
                if (solution[i][j] === FULL_CELL && board[i][j] !== FULL_CELL) {
                    return false;
                }
            }
        }
        return true;
    };

    this.getRunsOnX = function (x) {
        var runs = [],
            current = 0;

        solutionArray[x].forEach(function (item) {
            if (item === FULL_CELL) {
                current += 1;
            } else {
                if (current > 0)
                    runs.push(current);
                current = 0;
            }
        });

        if (current > 0)
            runs.push(current);
        return runs;
    };

    this.getAllRunsOnX = function () {
        var i, runs = [];
        for (i = 0; i < solutionArray.length; i++)
            runs.push(this.getRunsOnX(i));
        return runs;
    };

    this.getRunsOnY = function (y) {
        var runs = [],
            current = 0;

        solutionArray.forEach(function (x) {
            if (x[y] === FULL_CELL) {
                current += 1;
            } else {
                if (current > 0)
                    runs.push(current);
                current = 0;
            }
        });

        if (current > 0)
            runs.push(current);
        return runs;
    };

    this.getAllRunsOnY = function () {
        var i, runs = [];
        for (i = 0; i < solutionArray[0].length; i++)
            runs.push(this.getRunsOnY(i));
        return runs;
    };

    function initializeBoard() {
        var board = new Array(solution.length);

        for (var i = 0; i < board.length; i++)
            board[i] = new Array(solution.length);

        return board;
    }

};
