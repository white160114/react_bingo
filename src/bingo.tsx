import React, { useState } from 'react';
import './styles/Bingo.css';

const Bingo: React.FC = () => {
    const [numbers, setNumbers] = useState<number[]>(generateNumbers());
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);

    function generateNumbers(): number[] {
        let nums: number[] = [];
        for (let i = 1; i <= 75; i++) { // 数字の範囲を1から75に変更
            nums.push(i);
        }
        return shuffle(nums).slice(0, 25); // シャッフルして最初の25個を使用
    }

    function shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleNumberClick(number: number): void {
        if (!selectedNumbers.includes(number)) {
            setSelectedNumbers([...selectedNumbers, number]);
        }
    }

    function drawNumber(): void {
        const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1); // 1から75までの数字を生成
        const remainingNumbers = allNumbers.filter(num => !selectedNumbers.includes(num));
        if (remainingNumbers.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
            const drawnNumber = remainingNumbers[randomIndex];
            setCurrentNumber(drawnNumber);
            handleNumberClick(drawnNumber);
        }
    }

    function isBingo(): boolean {
        // ビンゴの判定ロジック
        const size = 5;
        const board = Array(size).fill(null).map(() => Array(size).fill(false));

        // ビンゴボードを作成
        numbers.forEach((number, index) => {
            const row = Math.floor(index / size);
            const col = index % size;
            if (selectedNumbers.includes(number)) {
                board[row][col] = true;
            }
        });

        // 横のビンゴ判定
        for (let row = 0; row < size; row++) {
            if (board[row].every(cell => cell)) {
                return true;
            }
        }

        // 縦のビンゴ判定
        for (let col = 0; col < size; col++) {
            if (board.every(row => row[col])) {
                return true;
            }
        }

        // 斜めのビンゴ判定
        if (board.every((row, index) => row[index])) {
            return true;
        }
        if (board.every((row, index) => row[size - 1 - index])) {
            return true;
        }
        return false;
    }

    return (
        <div className="bingo">
            <h1>ビンゴゲーム</h1>
            <button onClick={drawNumber}>数字を引く</button>
            {currentNumber !== null && <p>現在の数字: {currentNumber}</p>}
            <div className="bingo-board">
                {numbers.map((number, index) => (
                    <div
                        key={index}
                        className={`bingo-cell ${selectedNumbers.includes(number) ? 'selected' : ''}`}
                        onClick={() => handleNumberClick(number)}
                    >
                        {number}
                    </div>
                ))}
            </div>
            <div className="history">
                <h2>表示された数字の履歴</h2>
                <ul>
                    {selectedNumbers.map((number, index) => (
                        <li key={index}>{number}</li>
                    ))}
                </ul>
            </div>
            {isBingo() && <p>ビンゴ！</p>}
        </div>
    );
};

export default Bingo;