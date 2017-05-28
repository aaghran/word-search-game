var clicking = false;
function WordSolve(board, settings) {

    this.board = board;
    this.wordsToFind = this.board.settings.wordsList;
    this.wordsFound = [];

    //Words solved.
    this.solved = 0;

    // Default settings
    var default_settings = {
        "debug": true
    }
    this.settings = Object.merge(default_settings, settings);
    this.bindEvents();
}

WordSolve.prototype.bindEvents = function () {

    $("#ws-area").mousedown(function () {
        clicking = true;
    });

    $("#ws-area").mouseup(function () {
        clicking = false;
        $(".ws-col").removeClass("highlight");
    })

    // over and out

    $(".ws-col").on("mouseover", this.solvePuzzle.bind(this));
    //$(".ws-col").on("mousedown", this.solvePuzzle.bind(this));

    $.subscribe("solver/unbind", function () {
        $(".ws-col").off("mouseover");
        $(".ws-col").off("mousedown");
        $("#ws-area").off("mousedown");
        $("#ws-area").off("muoseup");
    });
};


WordSolve.prototype.solvePuzzle = function (event) {

    if (clicking) {
        var ele = $(event)[0].target;

        // Toggle highlight to box on click
        $(ele).toggleClass("highlight");

        var word = $(ele).attr('data-word'), // Get word attribute from clicked box.
            wordLen = word ? word.length : undefined,
            $box = $('.ws-col[data-word="' + word + '"]'); // Get all box's with word attribute.
        if (this.wordsFound.indexOf(word) == -1) {
            // Can be improved by having the highlighted in an array in and compare then.
            if ($('.ws-col[data-word="' + word + '"].highlight').length == wordLen) {
                // Word is fully highlighted, remove highlight and add class found
                $box.removeClass('highlight').addClass('found');
                if ($.inArray(word.toUpperCase(), this.wordsFound) == -1) {
                    this.wordsFound.push(word);
                    $('.ws-col').removeClass('highlight');
                    $.publish("solver/wordFound", [word]);
                }

            }
        }
        console.log(this.wordsFound);
        console.info(this.wordsFound.length + " - " + this.wordsToFind.length);

        if (this.wordsFound.length == this.wordsToFind.length) {
            $.publish("game/gameOver", [this]);
        }
    }
}

WordSolve.prototype.solveNextWord = function () {
    var wordsLeft = [];
    for (var i = 0; i < this.wordsToFind.length; i++) {
        if ($.inArray(this.wordsToFind[i].toUpperCase(), this.wordsFound) == -1) {
            wordsLeft.push(this.wordsToFind[i]);
        }
    }
    var word = wordsLeft[Math.rangeInt(0,wordsLeft.length-1)].toUpperCase();
    this.wordsFound.push(word);
    console.log(wordsLeft);
    console.log(this.wordsFound);
    $('.ws-col').removeClass('highlight');
    $.publish("solver/wordFound", [word]);

};






