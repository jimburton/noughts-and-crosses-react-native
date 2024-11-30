import { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import './App.css';
import Row from './Row';

export default function Index() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(" "));
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  
    function calculateWinner(squares) {
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
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] != " " && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    }
  
    function handleClick(i: number) {
      if (squares[i] != " " || calculateWinner(squares)) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    }
  
      return (
        <>
          <View><Text style={styles.status}>{status}</Text></View>
          {[0,1,2].map((m) => { return <Row key={m} rowNum={m} squares={squares} handleClick={handleClick}/> })}
        </>
      )
}
const styles = StyleSheet.create({
    status: {
        fontSize: 16,
        fontFamily: 'monospace',
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
  });
