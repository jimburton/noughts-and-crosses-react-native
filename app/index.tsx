import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Row from './Row';
import {terminal, getWinner, minimax} from './AI';

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
    const [status, setStatus] = useState("");
    const winner = calculateWinner(squares);
    setStatusStr(winner); 

    /** 
     * Set the value of status. 
     * 
     * @param {string} winner - Name of the winning player or null.
     * @returns {null}
     */
    function setStatusStr(winner: string) {
        if (!gameOver) {
            let statusStr;
            if (winner) {
                statusStr = winner === "Draw" ? winner : "Winner: " + winner;
            } else {
                statusStr = "Next player: " + (xIsNext ? "X" : "O");
            }
            if(statusStr != status) {
                setStatus(statusStr);
            }
        }
    }
    /** 
     * Reset the game. 
     * @returns {null}
     */
    function reset(): void {
        setSquares(Array(9).fill(" "));
        setXIsNext(true);
        setGameOver(false);
    }

    /** 
     * Calculate the winner. 
     * 
     * @param {string[]} squares - The board array.
     * @returns {string | null}
     */
    function calculateWinner(squares: string[]): string {
        if (!gameOver) {
            const winner = getWinner(squares);
            if(winner) {
                setStatusStr(winner);
                setGameOver(true);
            }
            return winner; 
        }
    }
    /** 
     * Calculate whether the game is over. 
     * 
     * @param {string[]} squares - The board array.
     * @returns {string | null}
     */
    function calculateGameOver(squares: string[]): string {
        if (!gameOver) {
            const winner = getWinner(squares);
            const done = terminal(squares);
            if(winner) {
                setStatusStr(winner);
                setGameOver(true);
            } else if (done) {
                setStatusStr("Draw");
                setGameOver(true);
            }
            return winner || done; 
        }
    }

    /** 
     * Callback for onPress events from Squares. 
     * 
     * @param {number} i - The number of the Square component that was clicked on.
     * @returns {null}
     */
    function handleClick(i: number): void {
        if (!gameOver) {
            if (squares[i] != " ") {
                return;
            }

            const nextSquares = squares.slice();
            if (xIsNext) {
                nextSquares[i] = "X";
            } else {
                nextSquares[i] = "O";
            }
            setSquares(nextSquares);
            const done = calculateGameOver(nextSquares);
            if (!done) {
                setXIsNext(!xIsNext);
                takeAIMove(nextSquares);
            }
        }
    }

    /**
     * Request a move from the AI player and update the board.
     * TODO: currently hardcoded to expect the AI player is O. Fix.
     * @param squares {string[]} - The board.
     */
    function takeAIMove(squares) {
        const [_,move] = minimax(squares, false);
        if(move != null) {
            const nextSquares = squares.slice();
            nextSquares[move] = "0";
            setSquares(nextSquares);
            const done = calculateGameOver(squares);
            if (!done) {
                setXIsNext(true);
            }
        } else {
            console.log("No move available");
        }
    }

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
