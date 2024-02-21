const gameBoard = (function() {
    const board = ['', '', '', '', '', '', '', '', ''];

    const reset = function() {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    const isFieldEmpty = function(index) {
        return board[index] === '';
    };

    const updateBoard = function(index, player) {
        board[index] = player.symbol;
    };

    return {
        reset,
        isFieldEmpty,
        updateBoard,
        board
    };
})();

const Player = function(symbol) {
    this.symbol = symbol;
};

const gameController = (function() {
    const players = [new Player('X'), new Player('O')];
    let currentPlayer = null;
    let isGameOver = false;

    const start = function() {
        currentPlayer = players[0];
        isGameOver = false;
        displayController.updatePlayerTurn();
    };

    const switchPlayer = function() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const checkWin = function() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winningCombinations.some(combination => {
            return combination.every(index => gameBoard.board[index] === currentPlayer.symbol);
        });
    };

    const checkDraw = function() {
        return gameBoard.board.every(cell => cell !== '');
    };

    const handleCellClick = function(event) {
        const cellIndex = event.target.id;

        if (!gameBoard.isFieldEmpty(cellIndex)) {
            return; // Cell already occupied
        }

        gameBoard.updateBoard(cellIndex, currentPlayer);
        event.target.textContent = currentPlayer.symbol;

        if (checkWin()) {
            displayController.showGameResult(`Player ${currentPlayer.symbol} wins!`);
            isGameOver = true;
            displayController.disableCells();
            return;
        }

        if (checkDraw()) {
            displayController.showGameResult("It's a draw!");
            isGameOver = true;
            displayController.disableCells();
            return;
        }

        switchPlayer();
        displayController.updatePlayerTurn();
    };

    return {
        start,
        handleCellClick
    };
})();

const displayController = (function() {
    const cells = document.querySelectorAll('.cell');
    const playerTurn = document.getElementById('player-turn');
    const gameResult = document.getElementById('game-result');
    const resetButton = document.getElementById('reset-button');

    const updatePlayerTurn = function() {
        playerTurn.textContent = gameController.currentPlayer.symbol;
    };

    const showGameResult = function(result) {
        gameResult.textContent = result;
    };

    const disableCells = function() {
        cells.forEach(cell => cell.removeEventListener('click', gameController.handleCellClick));
    };

    const resetGame = function() {
        gameBoard.reset();
        gameController.start();
        showGameResult('');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', gameController.handleCellClick);
        });
    };

    const handleCellClick = function(event) {
        if (!gameController.isGameOver) {
            gameController.handleCellClick(event);
        }
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    return {
        updatePlayerTurn,
        showGameResult,
        disableCells
    };
})();

gameController.start();