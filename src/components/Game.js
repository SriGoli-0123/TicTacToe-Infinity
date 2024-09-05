import React, { useState } from 'react';
import Board from './Board';

const Game = () => {
    const [boardSize, setBoardSize] = useState(3); // Default grid size
    const [squares, setSquares] = useState(Array(boardSize).fill(Array(boardSize).fill(null)));
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (i, j) => {
        if (squares[i][j] || calculateWinner(squares, boardSize)) return;

        const newSquares = squares.map((row, rowIndex) => {
            return row.map((col, colIndex) => {
                if (rowIndex === i && colIndex === j) {
                    return xIsNext ? 'X' : 'O';
                }
                return col;
            });
        });

        setSquares(newSquares);
        setXIsNext(!xIsNext);
    };

    const resetGame = (size) => {
        setBoardSize(size);
        setSquares(Array(size).fill(Array(size).fill(null)));
        setXIsNext(true);
    };

    const winner = calculateWinner(squares, boardSize);
    const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="game">
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => resetGame(3)}>3x3 Grid</button>
                <button onClick={() => resetGame(4)}>4x4 Grid</button>
                <button onClick={() => resetGame(5)}>5x5 Grid</button>
                <button onClick={() => resetGame(6)}>6x6 Grid</button>
            </div>
            <div className="game-board">
                <Board squares={squares} onClick={(i, j) => handleClick(i, j)} />
            </div>
        </div>
    );
};

const calculateWinner = (squares, size) => {
    const lines = [];

    // Rows
    for (let i = 0; i < size; i++) {
        lines.push(squares[i]);
    }

    // Columns
    for (let j = 0; j < size; j++) {
        const col = [];
        for (let i = 0; i < size; i++) {
            col.push(squares[i][j]);
        }
        lines.push(col);
    }

    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
        diagonal1.push(squares[i][i]);
        diagonal2.push(squares[i][size - 1 - i]);
    }
    lines.push(diagonal1);
    lines.push(diagonal2);

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].every(val => val === 'X')) return 'X';
        if (lines[i].every(val => val === 'O')) return 'O';
    }

    return null;
};

export default Game;
