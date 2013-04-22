"use strict";

var DinkelPicross = window.DinkelPicross || {};

DinkelPicross.createBuildUi = function (board, boardEl) {
    var i, j, $cells,
        yRuns = board.getAllRunsOnY(),
        maxYRuns = _.max(yRuns, function (x) { return x.length; }).length,
        xRuns = board.getAllRunsOnX(),
        maxXRuns = _.max(xRuns, function (x) { return x.length; }).length;

    for (i = 0; i < maxYRuns; i++) {
        _.each(_.range(maxXRuns), function () {appendRunDiv();});
        for (j = 0; j < board.width; j++) {
            appendRunDiv("y" + i + "_" + j, getRunText(yRuns[j], maxYRuns, i));
        }
        appendClear();
    }

    for (i = 0; i < board.height; i++) {
        for (j = 0; j < maxXRuns; j++) {
            appendRunDiv("x" + i + "_" + j, getRunText(xRuns[i], maxXRuns, j));
        }
        for (j = 0; j < board.width; j++) {
            boardEl.append($("<div>", { id: i + "_" + j, class: "cell" }));
        }
        appendClear();
    }

    function getRunText(run, max, idx) {
        var runMin = max - run.length;
        if (idx < runMin) return "";
        if (run.length === 0) return "0";
        return run[max - idx - 1];
    }

    function appendRunDiv(id, text) {
        boardEl.append($("<div>", { id: id, class: "run", text: text }));
    }

    function appendClear() {
        boardEl.append($("<div>", { style: "clear: both" }));
    }

    $cells = $(".cell");
    $cells.click(function (e) {
        var point = parseCellId(this);

        try {
            board.setCellFull(point.x, point.y);
        } catch (e) { /* don't care about this yet */
        }

        setCellClass(this, point.x, point.y);
    });

    $cells.bind("contextmenu", function (e) {
        var point = parseCellId(this);

        board.toggleCellMarked(point.x, point.y);

        setCellClass(this, point.x, point.y);

        return false;
    });

    function parseCellId(cellElement) {
        return {
            x: Number($(cellElement).attr("id").charAt(0)),
            y: Number($(cellElement).attr("id").charAt(2))
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