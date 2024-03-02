//import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Game() {
  const boardSize = 3;
  const [history, setHistory] = useState([Array(boardSize * boardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  function handlePlay(newSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((squares, move) => {
    let description = (move > 0 ? 'Go to move #' + move : 'Go to game start');
    return (<li key={move}><button onClick={() => jumpTo(move)}>{description}</button></li>);
  }

  );
  return (
    <>
      <div className="game">
        <div className="game-baord">
          <Board size={boardSize} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function Board({ size, xIsNext, squares, onPlay }) {

  const winner = calculateWinner(squares);
  let status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(newSquares);
  }

  const group = (items, n) => items.reduce((acc, x, i) => {
    const idx = Math.floor(i / n);
    acc[idx] = [...(acc[idx] || []), x];
    return acc;
  }, []);

  return (
    <>
      <div className="status">{status}</div>
      {group(squares, size).map((rows, index) =>
        <div key={index} className="board-row">
          {rows.map((square, i) => <Square key={i + index * size} value={square} onSquareClick={() => handleClick(i + index * size)} />)}
        </div>
      )}
    </>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <>
      <button className="square" onClick={onSquareClick}>{value}</button>
    </>
  );
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

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;