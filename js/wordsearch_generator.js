/**
 * Word seach
 *
 * @param {Element} wrapWl the game's wrap element
 * @param {Array} settings
 * constructor
 */
function WordSearch(wrapEl, settings) {
    this.wrapEl = wrapEl;

    // Add `.ws-area` to wrap element
    this.wrapEl.classList = 'ws-area';

    //Words solved.
    this.solved = 0;
    // Default settings
    var default_settings = {
        'directions': ['W', 'N', 'WN', 'EN'],
        'gridSize': 5,
        'words': ['army', 'beautiful', 'aaghran', 'actually', 'became', 'arrow', 'article', 'therefore', 'beside', 'between'],
        'wordsList': [],
        'debug': true
    }
    this.settings = Object.merge(default_settings, settings);

    this.words = this.settings.words;
    // Check the words' length if it is overflow the grid
    if (this.parseWords(this.settings.gridSize)) {
        // Add words into the matrix data
        var isWorked = false;

        while (isWorked == false) {
            // initialize the application
            this.initialize();

            isWorked = this.addWords();
        }

        // Fill up the remaining blank items
        if (!this.settings.debug) {
            this.fillUpFools();
        }

        // Draw the matrix into wrap element
        this.drawmatrix();
    }
}

/**
 * Parse words
 * @param {Number} Max size
 * @return {Boolean}
 */
WordSearch.prototype.parseWords = function (maxSize) {
    var itWorked = true;

    for (var i = 0; i < this.settings.words.length; i++) {
        // Convert all the letters to upper case
        this.settings.wordsList[i] = this.settings.words[i].trim();
        this.settings.words[i] = (this.settings.wordsList[i].trim().toUpperCase());

        var word = this.settings.words[i];
        if (word.length > maxSize) {
            //console.error('The length of word `' + word + '` is overflow the gridSize.');
            itWorked = false;
        }
    }

    return itWorked;
}

/**
 * Put the words into the matrix
 */
WordSearch.prototype.addWords = function () {
    var keepGoing = true,
        counter = 0,
        isWorked = true;

    while (keepGoing) {
        // Getting random direction
        var dir = this.settings.directions[Math.rangeInt(this.settings.directions.length - 1)],
            result = this.addWord(this.settings.words[counter], dir),
            isWorked = true;

        if (result == false) {
            keepGoing = false;
            isWorked = false;
        } else {
            counter++;
        }


        if (counter >= this.settings.words.length) {
            keepGoing = false;
        }
    }

    return isWorked;
}

/**
 * Add word into the matrix
 *
 * @param {String} word
 * @param {Number} direction
 */
WordSearch.prototype.addWord = function (word, direction) {
    var itWorked = true,
        directions = {
            'W': [0, 1], // Horizontal (From left to right)
            'N': [1, 0], // Vertical (From top to bottom)
            'WN': [1, 1], // From top left to bottom right
            'EN': [1, -1] // From top right to bottom left
        },
        row, col; // y, x

    switch (direction) {
        case 'W': // Horizontal (From left to right)
            var row = Math.rangeInt(this.settings.gridSize - 1),
                col = Math.rangeInt(this.settings.gridSize - word.length);
            break;

        case 'N': // Vertical (From top to bottom)
            var row = Math.rangeInt(this.settings.gridSize - word.length),
                col = Math.rangeInt(this.settings.gridSize - 1);
            break;

        case 'WN': // From top left to bottom right
            var row = Math.rangeInt(this.settings.gridSize - word.length),
                col = Math.rangeInt(this.settings.gridSize - word.length);
            break;

        case 'EN': // From top right to bottom left
            var row = Math.rangeInt(this.settings.gridSize - word.length),
                col = Math.rangeInt(word.length - 1, this.settings.gridSize - 1);
            break;

        default:
            var error = 'UNKNOWN DIRECTION ' + direction + '!';
            alert(error);
            console.log(error);
            break;
    }

    // Add words to the matrix
    for (var i = 0; i < word.length; i++) {
        var newRow = row + i * directions[direction][0],
            newCol = col + i * directions[direction][1];

        // The letter on the board
        var origin = this.matrix[newRow][newCol].letter;

        // if (origin == '.' || origin == word[i]) {
        if (origin == '.') {
            this.matrix[newRow][newCol].letter = word[i];
            this.matrix[newRow][newCol].word = word;
        } else {
            itWorked = false;
        }
    }

    return itWorked;
}

/**
 * Initialize the puzzle
 */
WordSearch.prototype.initialize = function () {
    this.matrix = [];
    this.selectFrom = null;
    this.selected = [];
    this.initmatrix(this.settings.gridSize);
}

/**
 * Fill default items into the matrix
 * @param {Number} size Grid size
 */
WordSearch.prototype.initmatrix = function (size) {
    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            var item = {
                letter: '.', // Default value
                row: row,
                col: col
            }

            if (!this.matrix[row]) {
                this.matrix[row] = [];
            }

            this.matrix[row][col] = item;
        }
    }
}

/**
 * Draw the matrix
 */
WordSearch.prototype.drawmatrix = function () {
    for (var row = 0; row < this.settings.gridSize; row++) {
        // New row
        var divEl = document.createElement('tr');
        divEl.setAttribute('class', 'ws-row');
        divEl.setAttribute('height', 25);
        this.wrapEl.append(divEl);

        for (var col = 0; col < this.settings.gridSize; col++) {
            var cvEl = document.createElement('td');
            cvEl.setAttribute('class', 'ws-col');
            cvEl.setAttribute('height', 25);
            cvEl.setAttribute('width', 25);
            if (this.matrix[row][col].word)
                cvEl.setAttribute('data-word', this.matrix[row][col].word);
            // Fill text in middle center
            var x = cvEl.width / 2,
                y = cvEl.height / 2;
            var content = document.createTextNode(this.matrix[row][col].letter, x, y);
            cvEl.appendChild(content);

            divEl.appendChild(cvEl);
        }
    }
}

/**
 * Fill up the remaining items
 */
WordSearch.prototype.fillUpFools = function () {
    var rangeLanguage = (this.settings.words[0].split('')[0]);
    for (var row = 0; row < this.settings.gridSize; row++) {
        for (var col = 0; col < this.settings.gridSize; col++) {
            if (this.matrix[row][col].letter == '.') {
                // Math.rangeInt(65, 90) => A ~ Z
                this.matrix[row][col].letter = String.fromCharCode(Math.rangeInt(65, 90));
            }
        }
    }
}


WordSearch.prototype.words = function () {
    return this.words
}

