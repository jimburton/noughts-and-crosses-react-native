/** 
 * An AI player for noughts and crosses using the Minimax algorithm.
 * @author James Burton
 * @date 03/12/2024
 * 
 */

/** 
 * Return a list of possible moves on the board. 
 * 
 * @param {string[]} board - The board.
 * @returns {number[]}
 */
function actions(board) {
    const acts = [];
    for (let i = 0; i < board.length; i++) {
        if(board[i] == " ") {
            acts.push(i);
        }
    }
    return acts;
}

/** 
 * Return number of occupied squares on the board. 
 * 
 * @param {string[]} board - The board.
 * @returns {number}
 */
function occupied(board) {
    return board.filter((pos) => pos != " ").length;
}

/** 
 * Decide whether the game is over. 
 * 
 * @param {string[]} board - The board.
 * @returns {boolean} - true if there is a winner or all cells are occupied, otherwise false.
 */
export function terminal(board) {
    return getWinner(board) ||  occupied(board) === 9;
}

const winning_lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/** 
 * Calculate the winner, if any. 
 * 
 * @param {string[]} board - The board.
 * @returns {string} - The name of the winner, or null.
 */
export function getWinner(board) {
    
    let winner = null;
    for (let i = 0; i < winning_lines.length; i++) {
        const [a, b, c] = winning_lines[i];
        if (board[a] != " " && board[a] == board[b] && board[a] == board[c]) {
            winner = board[a];
            break;
        }
    }
    return winner; 
}

function getWinningSquare(board, p) {
    for (let i = 0; i < winning_lines.length; i++) {
        const [a, b, c] = winning_lines[i];
        const onBoard = [board[a], board[b], board[c]];
        const numP = onBoard.filter((s) => s === p).length;
        const numBlank = onBoard.filter((s) => s === ' ').length;
        if (numP === 2 && numBlank === 1) {
            return [a, b, c][onBoard.indexOf(' ')];
        }
    }
    return null; 
}

/** 
 * Calculate the value of a board. 
 * 
 * @param {string[]} board - The board.
 * @returns {number} - 1 if the board is won by X, -1 if the board is won by O, otherwise 0.
 */
function utility(board) {
    const w =   getWinner(board);
    if (w == 'X') {
        return 1;
    } else if (w == 'O') {
        return -1;
    } else {
        return 0;
    }
}

/** 
 * Return the board that results from taking a move. 
 * 
 * @param {string[]} board - The board.
 * @returns {string[0]} - The new board.
 */
function result(board, move) {
    const result = board.slice();
    result[move] =  player(board);
    return result;
}

/** 
 * Calculate whose move it is. 
 * 
 * @param {string[]} board - The board.
 * @returns {string} - The name of the next player.
 */
export function player(board) {
    return  occupied(board) % 2 == 0 ? 'X' : 'O';
}

/** 
 * Implementation of the Minimax algorithm. 
 * 
 * @param {string[]} board - The board.
 * @param {boolean} xIsNext - true if X is next.
 * @returns {number} - The best move to take for the current player.
 */
export function minimax(board) {
    if (terminal(board)) {
      return [utility(board), null]; // Return utility and null move for terminal states
    }
    // hack because the algorithm is ignoring winning moves
    const p = player(board); 
    const opp = p === 'X' ? 'O' : 'X';
    const winningMove = getWinningSquare(board, p);
    if(winningMove) {
        const newBoard = result(board, winningMove); 
        return [utility(newBoard), winningMove];
    }
    const opposeWinningMove = getWinningSquare(board, opp);
    if(opposeWinningMove) {
        const newBoard = result(board, opposeWinningMove); 
        return [utility(newBoard), opposeWinningMove];
    }
    // end of hack
    const isMaximizingPlayer = p === 'X';
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
    let bestMove = null;

    actions(board).forEach((move) => {
        let newBoard = result(board, move);
        let [value, _] = minimax(newBoard);

        if (isMaximizingPlayer) {
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        } else {
            if (value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
    });

    return [bestValue, bestMove];
}

function printBoard(board, turn) {
    console.group(`Turn ${turn}:`); 
    console.log(board.slice(0,3).join(' | '));
    console.log('---------');
    console.log(board.slice(3,6).join(' | '));
    console.log('---------');
    console.log(board.slice(6,9).join(' | '));
    console.groupEnd();
}

export function play_yourself(board) {
    var xIsNext = player(board) === 'X';
    var turn = occupied(board) + 1;
    while (!terminal(board)) {
        board = result(board, minimax(board, xIsNext)[1]);
        printBoard(board, turn++);
        xIsNext = !xIsNext;
    }
    const winner = getWinner(board);
    console.log(winner ? `Winner is ${winner}!` : "It's a tie");
}

function two_ohs_and_one_blank(cells) {
    if (cells.length === 3) {
        const ohs = cells.filter((c) => c === 'O');
        if (ohs.length === 2) {
            return cells.indexOf(' ');
        }
    }
    return -1;
}
export function dumb(board) {
    let winning_spot = two_ohs_and_one_blank(board.slice(0,3));
    if (winning_spot != -1) {
        return winning_spot;
    }
    winning_spot = two_ohs_and_one_blank(board.slice(3,6));
    if (winning_spot != -1) {
        return 3+winning_spot;
    }
    winning_spot = two_ohs_and_one_blank(board.slice(6,9));
    if (winning_spot != -1) {
         return 6+winning_spot;
    }
    winning_spot = two_ohs_and_one_blank([board[0], board[3], board[6]]);
    if (winning_spot != -1) {
         return 6+winning_spot;
    }
    winning_spot = two_ohs_and_one_blank([board[1], board[4], board[7]]);
    if (winning_spot != -1) {
         return winning_spot+(winning_spot*3);
    }
    winning_spot = two_ohs_and_one_blank([board[2], board[5], board[8]]);
    if (winning_spot != -1) {
         return winning_spot+(winning_spot*3)+2;
    }
    winning_spot = two_ohs_and_one_blank([board[0], board[4], board[8]]);
    if (winning_spot != -1) {
         return winning_spot+(winning_spot*3)+1;
    }
    winning_spot = two_ohs_and_one_blank([board[2], board[4], board[6]]);
    if (winning_spot != -1) {
         switch (winning_spot) {
            case 0:
                return 2;
            case 1:
                return 4;
            case 2:
                return 6;
         }
    }
    return -1;
}
