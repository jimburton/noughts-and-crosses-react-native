import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Row from './Row';
import { terminal, getWinner, minimax, getNextPlayer } from './MiniMax';

/** 
 * A game of Noughts and Crosses using React Native. Made for teaching purposes
 * on the OU module TM352 Web, Mobile and Cloud Technology.
 * @author James Burton
 * @date 03/12/2024
 * @see {@link https://github.com/jimburton/noughts-and-crosses-react-native}
 * 
 */
export default function Index() {
    const [xIsNext, setXIsNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [squares, setSquares] = useState(Array(9).fill(" "));
    const [status, setStatus] = useState("Next player: X");

    /** * Calculates the winner or draw status and updates the game state.
     * @param {string[]} board - The board array.
     */
    const updateGameStatus = useCallback((board: string[]) => {
        const winner = getWinner(board);
        const isTerminal = terminal(board);

        if (winner) {
            setStatus("Winner: " + winner);
            setGameOver(true);
            return winner;
        }

        if (isTerminal) {
            setStatus("Draw");
            setGameOver(true);
            return "Draw";
        }

        // If not over, update the "Next player" status
        setStatus("Next player: " + (getNextPlayer(board)));
        return null;

    }, []);

    /** * Reset the game.
    */
    function reset() {
        setSquares(Array(9).fill(" "));
        setXIsNext(true);
        setGameOver(false);
        setStatus("Next player: X");
    }

    /** * Callback for onPress events from Squares (Human Move).
    *     After handling a click we want the MiniMax player to take a move. BUT rather
    *     than calling takeAIMove directly, we update the state and rely on takeAIMove being
    *     triggered via useEffect. This ensure that everything happens in the right sequence and
    *     updates to state are synchronised correctly.
    * * @param {number} i - The number of the Square component that was clicked on.
    */
    function handleClick(i: number) {
        if (gameOver || squares[i] !== " ") {
            return;
        }

        // Process Human Move
        const nextSquares = squares.slice();
        const currentPlayer = xIsNext ? "X" : "O";

        nextSquares[i] = currentPlayer;

        // Update State for Render (Human Move Complete)
        setSquares(nextSquares);
        setXIsNext(!xIsNext);

        // Update Status immediately based on this board
        updateGameStatus(nextSquares);
    }

    /** Effect to run the AI move when it is O's turn and the game is not over.
    */
    useEffect(() => {
        if (!xIsNext && !gameOver) {
            // Use a short delay to simulate "thinking" and ensure React finishes rendering the human move
            const timer = setTimeout(() => {
                const aiPlayer = 'O';
                takeAIMove(squares, aiPlayer);
            }, 500); // 500ms delay

            return () => clearTimeout(timer); // Cleanup
        }
    }, [xIsNext, gameOver, squares, updateGameStatus]);

    /**
    * Request a move from the AI player and update the board.
    * @param board {string[]} - The board state after the human's move.
    * @param aiPlayer {string} - The marker the AI is playing ('O').
    */
    function takeAIMove(board: string[], aiPlayer: string) {

        const [val, move] = minimax(board);

        if (move !== null) {
            const nextSquares = board.slice();
            nextSquares[move] = aiPlayer;
            setSquares(nextSquares);
            setXIsNext(true);
            updateGameStatus(nextSquares);
        } else {
            updateGameStatus(board);
        }
    }

    // Provide the UI.
    return (
        <>
        <View style={styles.statusContainer}><Text style={styles.status}>{status}</Text></View>
        {[0,1,2].map((m) => { return <Row key={m} rowNum={m} squares={squares} handleClick={handleClick}/> })}
        <TouchableOpacity style={[styles.resetButton,
                        {opacity: gameOver ? 100 : 0}]}
                    onPress={reset}><Text style={styles.resetButtonText}>Reset</Text></TouchableOpacity>
        </>
    )
}
const styles = StyleSheet.create({
    resetButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingVertical: 40,
        paddingHorizontal: 40,
        borderWidth: 2,
        borderColor: 'black',
        elevation: 3,
        backgroundColor: 'white',
    },
    resetButtonText: {
        fontSize: 17,
        fontFamily: 'monospace',
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    status: {
        fontSize: 17,
        fontFamily: 'monospace',
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
