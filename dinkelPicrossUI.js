"use strict";

var DinkelPicross = window.DinkelPicross || {};

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

        board.toggleCellMarked(point.x, point.y);

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