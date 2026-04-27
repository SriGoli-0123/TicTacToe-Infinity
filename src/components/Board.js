import React from 'react';
import Square from './Square';

const Board = ({ squares, onClick, xQueue, oQueue, winningLine }) => {
    return (
        <div className="board" style={{ gridTemplateColumns: `repeat(${squares.length}, 1fr)` }}>
            {squares.map((row, i) =>
                row.map((val, j) => {
                    const isWinningSquare = winningLine.some(pos => pos.i === i && pos.j === j);
                    
                    return (
                        <Square 
                            key={`${i}-${j}`} 
                            value={val} 
                            onClick={() => onClick(i, j)} 
                            isWinning={isWinningSquare}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Board;
