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
    var that = this;
    // $("#ws-area").mousedown(function (event) {
    //     event.preventDefault();
    //     clicking = true;
    // });

    $("#ws-area").mouseup(function (event) {
        event.preventDefault();
        clicking = false;
        $(".ws-col").removeClass("highlight");
    })

    // over and out

    $(".ws-col").on("mousedown", function (event) {
        event.preventDefault();
        clicking = true;
        that.solvePuzzle.call(this, event);
    });
    $(".ws-col").on("mouseover", that.solvePuzzle.bind(this));


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

        var word = $(ele).attr("data-word"), // Get word attribute from clicked box.
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
                    console.info("Words Found :" + this.wordsFound.length + " - " + this.wordsToFind.length);
                }

            }
        }

        if (this.wordsFound.length == this.wordsToFind.length) {
            $.publish("game/gameOver", [this]);
        }
    }
}
// Basically find trigger solver/wordFound for a random word from the list of words not yet found.
WordSolve.prototype.solveNextWord = function () {
    var wordsLeft = [];
    for (var i = 0; i < this.wordsToFind.length; i++) {
        if ($.inArray(this.wordsToFind[i].toUpperCase(), this.wordsFound) == -1) {
            wordsLeft.push(this.wordsToFind[i]);
        }
    }
    var index = Math.rangeInt(0, wordsLeft.length - 1);
    var word = wordsLeft[index];
    if (word) {
        word = word.toUpperCase();
        this.wordsFound.push(word);
        $('.ws-col').removeClass('highlight');
        $.publish("solver/wordFound", [word]);
    }
    if (this.wordsFound.length == this.wordsToFind.length) {
        $.publish("game/gameOver", [this]);
    }
};






