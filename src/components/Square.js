import React from 'react';

const Square = ({ value, onClick, isWinning }) => {
    return (
        <div className={`square ${isWinning ? 'radiant-square' : ''}`} onClick={onClick}>
            {value && (
                <span className={`mark ${value === 'X' ? 'mark-x' : 'mark-o'} ${isWinning ? 'radiant-mark' : ''}`}>
                    {value}
                </span>
            )}
        </div>
    );
};

export default Square;
