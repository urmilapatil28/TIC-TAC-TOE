let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize game
startGame();

// Event listeners
cells.forEach(cell => cell.addEventListener('click', () => handleCellClick(cell)));
restartButton.addEventListener('click', startGame);

function startGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = "Your turn (X)";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
}

function handleCellClick(cell) {
    const index = cell.dataset.index;
    if (gameBoard[index] !== '' || !gameActive || currentPlayer !== 'X') return;

    makeMove(index, 'X');
    if (gameActive) setTimeout(makeAIMove, 500);
}

function makeMove(index, player) {
    gameBoard[index] = player;
    cells[index].textContent = player;

    if (checkWin(player)) {
        message.textContent = player === 'X' ? 'You win!' : 'AI wins!';
        gameActive = false;
        disableBoard();
        return;
    }

    if (checkDraw()) {
        message.textContent = "It's a draw!";
        gameActive = false;
        disableBoard();
        return;
    }

    currentPlayer = player === 'X' ? 'O' : 'X';
    message.textContent = currentPlayer === 'X' ? 'Your turn (X)' : 'AI thinking...';
}

function checkWin(player) {
    return winningCombinations.some(combo => combo.every(index => gameBoard[index] === player));
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function disableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function makeAIMove() {
    const bestMove = minimax(gameBoard, 'O').index;
    makeMove(bestMove, 'O');
}

function minimax(board, player) {
    const availableMoves = board
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);

    // Check for terminal states
    if (checkWin('O')) return { score: 10 };
    if (checkWin('X')) return { score: -10 };
    if (availableMoves.length === 0) return { score: 0 };

    const moves = [];
    for (const index of availableMoves) {
        const move = {};
        move.index = index;
        board[index] = player;

        if (player === 'O') {
            move.score = minimax(board, 'X').score;
        } else {
            move.score = minimax(board, 'O').score;
        }

        board[index] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}