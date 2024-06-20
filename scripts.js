let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
const clickSound = new Audio('sounds/click.mp3');
const winSound = new Audio('sounds/win.mp3');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function makeMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        document.getElementById(`cell-${index}`).innerText = currentPlayer;
        clickSound.play();
        checkResult();
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                document.getElementById('game-status').innerText = `Computer's turn`;
                setTimeout(computerMove, 500); // Delay for a more natural feel
            } else {
                document.getElementById('game-status').innerText = `Player ${currentPlayer}'s turn`;
            }
        }
    }
}

function computerMove() {
    if (!gameActive) return;

    let bestMove = minimax(board, 'O').index;
    if (bestMove !== undefined) {
        makeMove(bestMove);
    }
}

function minimax(newBoard, player) {
    const availCells = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (availCells.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availCells.length; i++) {
        let move = {};
        move.index = availCells[i];
        newBoard[availCells[i]] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function checkResult() {
    let roundWon = false;

    for (const winCondition of winningConditions) {
        const [a, b, c] = winCondition.map(index => board[index]);

        if (a && a === b && b === c) {
            roundWon = true;
            winCondition.forEach(index => {
                document.getElementById(`cell-${index}`).style.backgroundColor = 'lightgreen';
            });
            break;
        }
    }

    if (roundWon) {
        winSound.play();
        document.getElementById('game-status').innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        document.getElementById('game-status').innerText = "It's a tie!";
        gameActive = false;
    }
}

function resetGame() {
    board.fill('');
    currentPlayer = 'X';
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.style.backgroundColor = ''; // Reset cell background color
    });
    document.getElementById('game-status').innerText = `Player ${currentPlayer}'s turn`;
}