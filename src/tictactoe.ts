/*
!   updates the board graphic
!   determines the winner
!   inspects the currentPlayer
!   updates the board state
*/

export enum PlayerNumber {
    xPlayer = 1,
    oPlayer
}

export class TicTacToe {
    public board: number[]
    public currentWinner: null | number = null
    //* x plays first

    constructor() {
        this.board = new Array(9).fill(0)
        this.updateBoard()
    }
    
    public makeMove(val: number, letter: PlayerNumber) {
        this.board[val] = letter
        if (this.anyWinner(letter, val)) {
            this.currentWinner = letter
            return true
        }
        return false
    }

    public updateBoard() {
        const children = document.querySelectorAll('.div_container div') as NodeListOf<HTMLDivElement>
        children.forEach((div, index) => {
            if (this.board[index] === PlayerNumber.xPlayer) {
                div.innerText = 'X'
            } 
            else if (this.board[index] === PlayerNumber.oPlayer) {
                div.innerText = 'O'
            }
            else {
                div.innerText = ''
            }
        })
    }

    public anyWinner(player: number, index: number) {
        let rowInd = Math.floor(index / 3)
        const row = this.board.slice(rowInd * 3, (rowInd + 1) * 3)
        if (row.every((v) => v === player)) return true

        let colInd = index % 3
        const col = Array.from({length: 3}, (_, i) => this.board[colInd + i*3])
        if (col.every((v) => v === player)) return true        

        if (index % 2 === 0) {
            const diagonal1 = Array.from({length: 3}, (_, i) => this.board[i * 4])
            if (diagonal1.every((v) => v == player)) return true
            
            const diagonal2 = Array.from({length: 3}, (_, i) => this.board[2 + i * 2])
            if (diagonal2.every((v) => v == player)) return true
        }
        return false
    }

    public isValidMove(val: number) {
        return this.board[val] === 0
    }

    public availableMoves() {
        return this.board.reduce((acc: number[], val, ind) => {
            if (val == 0) {
                acc.push(ind)
            }
            return acc
        }, [])
    }

    public emptySquares() {
        return this.board.indexOf(0) !== -1
    }

    public numEmptySquares() {
        return this.availableMoves().length
    }
    
}
