import './style.css'
import { HumanPlayer, IAPlayer } from './player.js';
import { TicTacToe, PlayerNumber } from "./tictactoe.js"

window.addEventListener('DOMContentLoaded', () => {
    let controller = new AbortController()
    play(controller.signal)    

    const $restart = document.getElementById('restart') as HTMLButtonElement
    $restart.addEventListener('click', (_) => {
        controller.abort()
        controller = new AbortController()
        play(controller.signal)
    })
})
 
 
async function play(signal: AbortSignal) {
    const tic = new TicTacToe()
    // const xplayer = new HumanPlayer('.div_container', PlayerNumber.xPlayer)
    const oplayer = new HumanPlayer('.div_container', PlayerNumber.oPlayer)
    const iaplayer = new IAPlayer(tic, PlayerNumber.xPlayer)
    let p = PlayerNumber.oPlayer
    let winner = false
    while (tic.emptySquares()) {
        if (p == PlayerNumber.xPlayer) {
            let val = iaplayer.getMove() as number
            winner = tic.makeMove(val, PlayerNumber.xPlayer)
        }
        else {
            let val = await oplayer.getMove(tic, signal) as number
            winner = tic.makeMove(val, PlayerNumber.oPlayer)
        }
        tic.updateBoard()
        if (winner) {
            setTimeout(() => {
                alert(`${p == PlayerNumber.xPlayer ? 'X' : 'O'} wins`)
            }, 0.1)
            break
        }
        p = p == PlayerNumber.oPlayer ? PlayerNumber.xPlayer : PlayerNumber.oPlayer
    }
    if (!tic.emptySquares() && !winner) {
        setTimeout(() => {
            alert('It\'s a tie')
        }, 0.1)   
    }
}
 




