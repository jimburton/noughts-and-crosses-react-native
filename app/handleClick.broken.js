/** 
 * Callback for onPress events from Squares. BROKEN.
 * 
 * @param {number} i - The number of the Square component that was clicked on.
 * @returns {null}
 */
function handleClick(i: number): void {
    if (!gameOver) {
        if (squares[i] != " ") {
            return;
        }
        // PROBLEM squares is managed state, are we definitely looking at an up to date version of it?
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        setSquares(nextSquares);
        const done = calculateGameOver(nextSquares);
        if (!done) {
            setXIsNext(!xIsNext); // PROBLEM xIsNext is managed state, we aren't sure when it will be changed
            takeAIMove(nextSquares);
        }
    }
}
