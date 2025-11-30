// Minimax player for Noughts and Crosses.

/** * Return a list of possible moves on the board.
  * @param {string[]} board - The board.
  * @returns {number[]}
  */
 function actions(board) {
     const acts = [];
     for (let i = 0; i < board.length; i++) {
         if(board[i] === " ") {
             acts.push(i);
         }
     }
     return acts;
 }

 /** * Return number of occupied squares on the board.
  * @param {string[]} board - The board.
  * @returns {number}
  */
 function occupied(board) {
     return board.filter((pos) => pos !== " ").length;
 }

 const winning_lines = [
     [0, 1, 2], [3, 4, 5], [6, 7, 8],
     [0, 3, 6], [1, 4, 7], [2, 5, 8],
     [0, 4, 8], [2, 4, 6]
 ];

 /** * Calculate the winner, if any.
  * @param {string[]} board - The board.
  * @returns {string | null} - The name of the winner ('X' or 'O'), or null.
  */
 export function getWinner(board) {
     let winner = null;
     for (let i = 0; i < winning_lines.length; i++) {
         const [a, b, c] = winning_lines[i];
         if (board[a] !== " " && board[a] === board[b] && board[a] === board[c]) {
             winner = board[a];
             break;
         }
     }
     return winner;
 }

 /** * Decide whether the game is over.
  * @param {string[]} board - The board.
  * @returns {boolean} - true if there is a winner or all cells are occupied, otherwise false.
  */
 export function terminal(board) {
     return getWinner(board) ||  occupied(board) === 9;
 }

 /** * Calculate whose move it is.
  * @param {string[]} board - The board.
  * @returns {string} - The name of the next player ('X' or 'O').
  */
 export function getNextPlayer(board) {
     return occupied(board) % 2 === 0 ? 'X' : 'O';
 }

 /** * Return the board that results from taking a move.
  * @param {string[]} board - The board.
  * @param {number} move - The index of the move.
  * @returns {string[]} - The new board.
  */
 function result(board, move) {
     const newBoard = board.slice();
     newBoard[move] = getNextPlayer(board);
     return newBoard;
 }

 /** * Calculate the value of a board.
  * @param {string[]} board - The board.
  * @returns {number} - 1 if the board is won by X, -1 if the board is won by O, otherwise 0.
  */
 function utility(board) {
     const w = getWinner(board);
     if (w === 'X') {
         return 1;
     } else if (w === 'O') {
         return -1;
     } else {
         return 0;
     }
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


 /** * Implementation of the Minimax algorithm.
  * @param {string[]} board - The board.
  * @returns {[number, number | null]} - The best value and the best move (index).
  */
 export function minimax(board) {
     if (terminal(board)) {
       return [utility(board), null];
     }

     // Determine current player
     const p = getNextPlayer(board);
     const isMaximizingPlayer = p === 'X';

     // Optimization: Check for immediate win/block
     const winningMove = getWinningSquare(board, p);
     if (winningMove !== null) {
         return [isMaximizingPlayer ? 1 : -1, winningMove];
     }

     const opp = p === 'X' ? 'O' : 'X';
     const blockingMove = getWinningSquare(board, opp);
     if (blockingMove !== null && occupied(board) > 1) { // Block if opponent is close to winning, not necessary on turn 1
          // Don't calculate utility here, just return the move.
         // Minimax will handle the actual value later if needed, but blocking is usually key.
         return [isMaximizingPlayer ? 0 : 0, blockingMove];
     }

     let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
     let bestMove = null;

     actions(board).forEach((move) => {
         let newBoard = result(board, move);
         // Recursive call
         let [value, _] = minimax(newBoard);

         if (isMaximizingPlayer) {
             if (value > bestValue) {
                 bestValue = value;
                 bestMove = move;
             }
         } else { // Minimizing Player ('O')
             if (value < bestValue) {
                 bestValue = value;
                 bestMove = move;
             }
         }
     });

     return [bestValue, bestMove];
 }