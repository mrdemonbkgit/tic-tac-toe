let board = ['', '', '', '', '', '', '', '', ''];
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
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameActive) {
            document.getElementById('game-status').innerText = `Player ${currentPlayer}'s turn`;
        }
    }
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            // Highlight winning cells
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
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.style.backgroundColor = ''; // Reset cell background color
    });
    document.getElementById('game-status').innerText = `Player ${currentPlayer}'s turn`;
}