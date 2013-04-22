/// <reference path="../lib/qunit.js" />
"use strict";

(function () {
    module("Tests", {
        setup: function () {
            this.board = new DinkelPicross.Board([[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]]);
        }
    });

    test("Canary test", function () {
        ok(true, "If failed the canary died");
    });

    test("Board has width and height properties", function () {
        strictEqual(this.board.width, 5);
        strictEqual(this.board.height, 5);
        strictEqual(this.board.errors, 0);
    });

    test("getCell gets a cell's status", function () {
        strictEqual(this.board.getCell(0, 0), undefined);
    });

    test("setCellFull throws an exception if doesn't match solution", function () {
        raises(function () { this.board.setCellFull(1, 1) });
    });

    test("errors count grows when setCellFull throws an exception", function () {
        raises(function () { this.board.setCellFull(1, 1) });
        strictEqual(this.board.errors, 1);
    });

    test("isErrorCell is true when setCellFull throws an exception", function () {
        raises(function () { this.board.setCellFull(1, 1) });
        ok(this.board.isErrorCell(1, 1));
    });

    test("Cell is set to 'marked' when setCellFull throws an exception", function () {
        raises(function () { this.board.setCellFull(1, 1) });
        strictEqual(this.board.getCell(1, 1), 0);
    });

    test("setCellFull sets the given cell to 'full'", function () {
        strictEqual(this.board.getCell(0, 0), undefined);
        this.board.setCellFull(0, 0);
        strictEqual(this.board.getCell(0, 0), 1);
    });

    test("setCellFull is ignored if the given cell is an error cell", function () {
        raises(function () { this.board.setCellFull(1, 1) });
        this.board.setCellFull(1, 1);
        strictEqual(this.board.getCell(1, 1), 0);
    });

    test("toggleCellMarked sets the given cell to 'marked'", function () {
        strictEqual(this.board.getCell(0, 0), undefined);
        this.board.toggleCellMarked(0, 0);
        strictEqual(this.board.getCell(0, 0), 0);
    });

    test("toggleCellMarked when full is ignored", function () {
        this.board.setCellFull(0, 0);
        this.board.toggleCellMarked(0, 0);
        strictEqual(this.board.getCell(0, 0), 1);
    });

    test("toggleCellMarked toggles when called multiple times", function () {
        this.board.toggleCellMarked(0, 0);
        strictEqual(this.board.getCell(0, 0), 0);
        this.board.toggleCellMarked(0, 0);
        strictEqual(this.board.getCell(0, 0), undefined);
        this.board.toggleCellMarked(0, 0);
        strictEqual(this.board.getCell(0, 0), 0);
    });

    test("toggleCellMarked doesn't toggle when cell is an error cell", function () {
        raises(function () { this.board.setCellFull(1, 1) });
        this.board.toggleCellMarked(1, 1);
        strictEqual(this.board.getCell(1, 1), 0);
    });

    test("setCellFull sets cell to 'empty' when cell is 'marked' and not fail if doesn't match solution", function () {
        this.board.toggleCellMarked(1, 1);
        this.board.setCellFull(1, 1);
        strictEqual(this.board.getCell(1, 1), undefined);
    });

    test("boardCompleted returns true when board matches solution", function () {
        this.board.setCellFull(0, 0);
        this.board.setCellFull(0, 1);
        this.board.setCellFull(0, 2);
        this.board.setCellFull(0, 3);
        this.board.setCellFull(1, 0);
        this.board.setCellFull(1, 4);
        this.board.setCellFull(2, 0);
        this.board.setCellFull(2, 4);
        this.board.setCellFull(3, 0);
        this.board.setCellFull(3, 4);
        this.board.setCellFull(4, 0);
        this.board.setCellFull(4, 1);
        this.board.setCellFull(4, 2);
        ok(!this.board.boardCompleted());
        this.board.setCellFull(4, 3);
        ok(this.board.boardCompleted());
    });

    test("getRunsOnX gives the solution runs on the given x-axis", function () {
        deepEqual(this.board.getRunsOnX(0), [4]);
        deepEqual(this.board.getRunsOnX(1), [1,1]);
    });

    test("getRunsOnY gives the solution runs on the given y-axis", function () {
        deepEqual(this.board.getRunsOnY(0), [5]);
        deepEqual(this.board.getRunsOnY(1), [1,1]);
        deepEqual(this.board.getRunsOnY(4), [3]);
    });

    test("getAllRunsOnX gives the solution runs for all x-axis", function () {
        deepEqual(this.board.getAllRunsOnX(), [[4],[1,1],[1,1],[1,1],[4]]);
    });

    test("getAllRunsOnY gives the solution runs for all y-axis", function () {
        deepEqual(this.board.getAllRunsOnY(), [[5],[1,1],[1,1],[1,1],[3]]);
    });
}());