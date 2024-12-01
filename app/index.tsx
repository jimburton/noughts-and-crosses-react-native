import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Row from './Row';

export default function Index() {
    const [xIsNext, setXIsNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [squares, setSquares] = useState(Array(9).fill(" "));
    const [status, setStatus] = useState("");
    const winner = calculateWinner(squares);
    setStatusStr(winner);

    function setStatusStr(winner) {
        if (!gameOver) {
            let statusStr;
            if (winner) {
                statusStr = "Winner: " + winner;
            } else {
                statusStr = "Next player: " + (xIsNext ? "X" : "O");
            }
            if(statusStr != status) {
                setStatus(statusStr);
            }
        }
    }

    function reset() {
        setSquares(Array(9).fill(" "));
        setXIsNext(true);
        setGameOver(false);
    }

    function calculateWinner(squares) {
        if (!gameOver) {
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
                if (squares[a] != " " && squares[a] === squares[b] && squares[a] === squares[c]) {
                    winner = squares[a];
                    break;
                }
            }
            if(winner) {
                setStatusStr(winner);
                setGameOver(true);
            }
            return winner;
        }
    }

    function handleClick(i: number) {
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
            const winner = calculateWinner(squares);
            if (!winner) {
                setXIsNext(!xIsNext);
            }
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
