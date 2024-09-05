import React from 'react';
import Square from './Square';

const Board = ({ squares, onClick }) => {
    const renderSquare = (i, j) => {
        return (
            <Square
                key={`${i}-${j}`}
                value={squares[i][j]}
                onClick={() => onClick(i, j)}
            />
        );
    };

    const renderRow = (row, rowIndex) => {
        return (
            <div className="board-row" key={rowIndex}>
                {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
            </div>
        );
    };

    return (
        <div>
            {squares.map((row, rowIndex) => renderRow(row, rowIndex))}
        </div>
    );
};

export default Board;
