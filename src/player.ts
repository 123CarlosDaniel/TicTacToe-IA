import { TicTacToe, PlayerNumber } from './tictactoe.js';

export interface Player {
    letter: number
    // getMove(board?:TicTacToe, signal?: AbortSignal): Promise<unknown> | number
}    
 
export class HumanPlayer implements Player {
    letter: number
    public boardContainer: HTMLDivElement

    constructor(bContId: string, letter: PlayerNumber) {
        this.letter = letter
        this.boardContainer = document.querySelector(bContId) as HTMLDivElement

    }

    private clickHandler = (res: Function) => {
        return (e: MouseEvent) => {
            const target = e.target as HTMLDivElement
            let index: any = target.dataset.ind
            if (index === undefined) {
                console.log('Selecciona una celda valida')
                return
            }
            index = Number(index)
            res(index)
        } 
    }

    public async getMove(board: TicTacToe , signal: AbortSignal): Promise<unknown> {
        let handler: any
        while (true) {
            try {
                let val = await new Promise((res, rej) => {
                    signal.addEventListener('abort', () => {
                        rej('Aborted')
                    }) 
                    handler = this.clickHandler(res)
                    this.boardContainer.addEventListener('click', handler)
                }) as number
                if (board.isValidMove(val)) {
                    return val
                }
            } finally {
                this.boardContainer.removeEventListener('click', handler)
            }
        }
    }

}

export class IAPlayer implements Player {
    letter: number 
    private state: TicTacToe
    constructor(state: TicTacToe, letter: number) {
        this.letter = letter
        this.state = state
    }

    public getMove() {
        if (this.state.availableMoves().length == 9) {
            return Math.floor(Math.random() * 9)
        }
        else {
            return this.minimax()['position']
        }
    }
    
    private minimax(player: PlayerNumber = this.letter) : {
        position: null | number
        score: number
    } {
        const maxPlayer = this.letter
        const otherPlayer = player == PlayerNumber.xPlayer 
                            ? PlayerNumber.oPlayer : PlayerNumber.xPlayer
        if (this.state.currentWinner == otherPlayer) {
            let num = this.state.numEmptySquares() + 1
            return {
                position : null,
                score: otherPlayer == maxPlayer 
                    ? num
                    : -1 * num 
            }
        }
        else if (!this.state.emptySquares()) {
            return {
                position: null,
                score: 0
            }
        }
        let best 
        if (player == maxPlayer) {
            best = {position: null, score: -Infinity}
        }
        else {
            best = {position: null, score: Infinity}
        }

        for (let posibleMove of this.state.availableMoves()) {
            this.state.makeMove(posibleMove, player)
            const simScore = this.minimax(otherPlayer)

            this.state.board[posibleMove] = 0
            this.state.currentWinner = null
            simScore['position'] = posibleMove

            if (player == maxPlayer) {
                if (simScore['score'] > best['score']) {
                    best = simScore
                }
            }
            else {
                if (simScore['score'] < best['score']) {
                    best = simScore
                }
            }
        }
        return best
    }
}