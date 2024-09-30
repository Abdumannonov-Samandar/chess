"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Player = 'red' | 'black'
type Cell = Player | null

export default function CheckersCard() {
  const [board, setBoard] = useState<Cell[][]>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red')
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null)

  function initializeBoard(): Cell[][] {
    const board: Cell[][] = Array(8).fill(null).map(() => Array(8).fill(null))
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 !== 0) board[i][j] = 'black'
      }
    }
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 !== 0) board[i][j] = 'red'
      }
    }
    return board
  }

  function handleCellClick(row: number, col: number) {
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece
      if (isValidMove(selectedRow, selectedCol, row, col)) {
        const newBoard = [...board]
        newBoard[row][col] = currentPlayer
        newBoard[selectedRow][selectedCol] = null
        setBoard(newBoard)
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red')
        setSelectedPiece(null)
      } else {
        setSelectedPiece(null)
      }
    } else if (board[row][col] === currentPlayer) {
      setSelectedPiece([row, col])
    }
  }

  function isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
    
    if (board[toRow][toCol] !== null) return false
    
    if (currentPlayer === 'red' && toRow >= fromRow) return false
    if (currentPlayer === 'black' && toRow <= fromRow) return false
    
    if (rowDiff === 1 && colDiff === 1) return true
    
    if (rowDiff === 2 && colDiff === 2) {
      const middleRow = (fromRow + toRow) / 2
      const middleCol = (fromCol + toCol) / 2
      return board[middleRow][middleCol] === (currentPlayer === 'red' ? 'black' : 'red')
    }
    
    return false
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Checkers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-1 aspect-square">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square ${
                  (rowIndex + colIndex) % 2 === 0 ? 'bg-orange-200' : 'bg-orange-800'
                } flex items-center justify-center`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell && (
                  <div
                    className={`w-3/4 h-3/4 rounded-full ${
                      cell === 'red' ? 'bg-red-600' : 'bg-gray-800'
                    } ${
                      selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex
                        ? 'ring-2 ring-yellow-400'
                        : ''
                    }`}
                  />
                )}
              </div>
            ))
          )}
        </div>
        <p className="mt-4 text-center">
          Current player: <span className="font-bold">{currentPlayer}</span>
        </p>
      </CardContent>
    </Card>
  )
}