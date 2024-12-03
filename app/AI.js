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
     * Decide whether a move is legal. 
     * 
     * @param {string[]} board - The board.
     * @param {move} - The move to play.
     * @returns {boolean} - true if the move is on the board and the square is unoccupied, otherwise false.
     */
    function legal_move(board, move) {
        return move >= 0 && move <= 8 && board[move] === " ";
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

    /** 
     * Calculate the winner, if any. 
     * 
     * @param {string[]} board - The board.
     * @returns {string} - The name of the winner, or null.
     */
    export function  getWinner(board) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        let winner = null;
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] != " " && board[a] === board[b] && board[a] === board[c]) {
                winner = board[a];
                break;
            }
        }
        return winner; 
    }

    /** 
     * Calculate the value of a board. 
     * 
     * @param {string[]} board - The board.
     * @returns {number} - 1 if the board is won by X, -1 if the board is won by O, otherwise 0.
     */
    function utility(board) {
        w =   getWinner(board);
        switch (w) {
            case 'X':
                return 1;
            case 'O':
                return -1;
            default:
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
    function player(board) {
        return  occupied(board) % 2 == 0 ? 'X' : 'O';
    }

    /** 
     * Implementation of the Minimax algorithm. 
     * 
     * @param {string[]} board - The board.
     * @param {boolean} xIsNext - true if X is next.
     * @returns {number} - The best move to take for the current player.
     */
    export function minimax(board, xIsNext) {
        console.log("board: "+board);
        let move = null;
        if(occupied(board) == 0) {
            return 4;
        } else if (terminal(board)) {
            return null;
        } else if (xIsNext) {
            console.log("Calling maxValue for the first time");
            [v, move] =  maxValue(board);
        } else {
            console.log("Calling minValue for the first time");
            [v, move] =  minValue(board);
        }
        console.log("minimax got move: "+move);
        if(move == null) {
            const acts = actions(board);
            if(acts.length > 0) {
                move = acts[0];
            }
        }
        return move;
    }

    /** 
     * Calculate the best move to minimise the value of the board. 
     * 
     * @param {string[]} board - The board.
     * @returns {number} - The best move to take to minimise value.
     */
    function minValue(board) {
        if (terminal(board)) {
            return [ utility(board), null];
        }

        let v = Number.POSITIVE_INFINITY;
        let move = null;
        for (const action of  actions(board)) {
            const [aux, m] =  maxValue( result(board, action));
            if (aux < v) {
                v = aux;
                move = action;
                if (v == -1) { // pruning
                    return [v, move];
                }
            }
        }
        return [v, move];
    }

    /** 
     * Calculate the best move to maximise the value of the board. 
     * 
     * @param {string[]} board - The board.
     * @returns {number} - The best move to take to maximise value.
     */
    function maxValue(board) {
        if (terminal(board)) {
            return [ utility(board), null];
        }

        v = Number.NEGATIVE_INFINITY;
        move = null;
        for (const action of  actions(board)) {
            [aux, m] =  minValue( result(board, action));
            if (aux > v) {
                v = aux;
                move = action;
                if (v == 1) { // pruning
                    return [v, move];
                }
            }
        }
        return [v, move];
    }
