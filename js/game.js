"use strict";

function Player(name, properties) {
    this.name = name || "Aaghran";
    this.score = 0;
    this.wordsFound = [];
    this.skips = 0;
    this.rounds = 0;
    this.isBot = properties.isBot ? true : false;
    this.color = properties.color ? properties.color : "blue";

    //  this.initialize();
};


Player.prototype.updateScore = function (pts) {
    this.score += pts;
    $(".js-player-" + this.name + "-score").html(this.score);
};

Player.prototype.skipTurn = function (pts) {
    this.skips += 1;
    this.rounds += 1;
};

Player.prototype.updateWordsFound = function (word) {
    this.wordsFound.push(word);
    $(".js-player-" + this.name + "-words").append("<div class='each-word'>" + word + "<div>");
};

Player.prototype.createPlayerHtml = function () {
    var html = $(".js-player-template").clone();
    html.removeClass("js-player-template");
    html.find(".js-player-name").html(this.name);
    html.addClass("js-player-" + this.name);
    html.addClass("player-color-" + this.color);
    html.attr("data-player", this.name);
    html.find(".js-player-name-words").attr("data-player", this.name);
    html.find(".js-player-name-score").attr("data-player", this.name);
    html.find(".js-player-name-words").addClass("js-player-" + this.name + "-words");
    html.find(".js-player-name-score").addClass("js-player-" + this.name + "-score");
    return html;
};

function Game(settings) {
    // this.wrapEl = wrapEl;
    //
    // // Add `.ws-area` to wrap element
    // this.wrapEl.classList = "ws-area";

    //Words solved.
    this.players = [];
    this.playing = 0;
    this.winner = {};
    this.gameobj = {};
    this.solve = {};
    this.mode = "single";
    // Default settings
    var default_settings = {
        "gridSize": 15,
        "colors": ["red", "green", "blue", "purple","yellow"],
        "words": ["army", "test", "one", "two", "three", "four","five","six", "seven", "eight","whether","travel","logic","camera","photography"],
        //"words": ["camera","photography"],
        "debug": true
    }
    this.settings = Object.merge(default_settings, settings);

};

Game.prototype.initialize = function (players) {
    var that = this;
    this.settings
    for (var i = 0; i <= players.length - 1; i++) {
        var player = new Player(players[i], {color: this.settings.colors[i]});
        this.players.push(player);

    }
    if(this.players.length  == 1) {
        console.info("Adding a bot");
        this.players.push(new Player("WordBot", {isBot : true}))
    }
    this.createBoard(this.players, this.settings);
    this.playing = 0;

    $.subscribe("solver/wordFound", function (ele, word) {
        $(".ws-col[data-word='" + word + "']").addClass("found-" + that.players[that.playing].color);
        $(".ws-" + word).addClass("strike");
        that.addScore(word);
        that.turnChange();
        console.log("solved!!!")
    });
    for (var i = 0; i < this.players.length; i++) {
        $(".player-list").append(this.players[i].createPlayerHtml());
    }

    for (var i = 0; i < this.settings.words.length; i++) {
        $(".ws-words").append("<span class='ws-"+this.settings.words[i]+"'>" + this.settings.words[i] + "</span>")
    }

    $.subscribe("game/gameOver", function (ele, solved) {
        that.setWinner();
        $.publish("solver/unbind");
        $(".js-player-"+that.winner.name).addClass("playing winner");
        $(".js-player").removeClass("playing");
        alert("Winner is " + that.winner.name);
        //@TODO : Alert panel and restart / new game option menu
    });
    $(".js-player-" + this.players[this.playing].name).addClass("playing");
};

Game.prototype.createBoard = function (players, settings) {
    var gameAreaEl = $("#ws-area");
    this.gameobj = new WordSearch(gameAreaEl, settings);

    this.solve = new WordSolve(this.gameobj, settings);
    $(".game").show();
    $(".intro").hide();
};

Game.prototype.addScore = function (word) {
    var score = word.length;
    this.players[this.playing].updateScore(score);
    this.players[this.playing].updateWordsFound(word);
};

Game.prototype.turnChange = function () {
    var playerCount = this.players.length;
    if (this.playing == playerCount - 1)
        this.playing = 0;
    else
        this.playing++;
    if( this.players[this.playing].isBot) {
        this.solve.solveNextWord();
    }
    $(".js-player").removeClass("playing");
    $(".js-player-" + this.players[this.playing].name).addClass("playing");

};

Game.prototype.setWinner = function () {
    this.winner = this.players[0];
    for (var i = 1; i < this.players.length; i++) {
        if (this.winner.score < this.players[i].score) {
            this.winner = this.players[i];
        }
    }
};


(function () {
    var player = 1;
    $("#addPlayers").click(function () {
        player ++;
        $(".player-input-list").append("<input type='text' placeholder='Enter Player "+player+" name' name='player"+player+"' class='js-player-input'>");
    });

    $("#startGame").click(function () {
        var game = new Game();
        var players = [];
        $(".js-player-input").each(function (key) {
            if ($(this).val()) {
                console.log(key + ": " + $(this).val());
                players.push($(this).val());
            }
        });
        if(players.length < 1) {
            alert("Please enter at least one player");
            return;
        }
        game.initialize(players);
    })
})();