import './Arena.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sprite from './Sprite';

async function downloadBot(bot1, bot2) {
    var res = await axios({
      method: 'post',
      url: 'http://localhost:8080/download',
      data: JSON.stringify({filename1 : bot1,
                            filename2 : bot2}),
      headers: { 'Content-Type': 'application/json' },
    });
}

async function playGame() {
    var res = await axios({
      method: 'post',
      url: 'http://localhost:8080/play',
    });

    console.log(res.data);

    return res.data;
}

export default function Arena() {
    const [player1, setPlayer1] = useState();
    const [player2, setPlayer2] = useState();
    const [fightStarted, setFightStarted] = useState(false);
    const [simulationStarted, setSimulationStarted] = useState(false);
    const [stateIdx, setStateIdx] = useState(0);
    const [gameStates, setGameStates] = useState();
    const [winner, setWinner] = useState();
    const [boards, setBoards] = useState();
    const [tileMap, setTileMap] = useState();
    let x = 0;
    const generalScale = 1;

    let handleSubmit = () => {
        setFightStarted(true);
        downloadBot(player1, player2);
    }

    let cellToTable = (cell) => {
        var text = "";
        if (cell.hq == 1) {
            text = "HQ: ";
        } else if (cell.tower == 1) {
            text = "T: ";
        }

        var color = "";
        if (cell.faction == 1)
            color = "#f00";
        else if (cell.faction == 2)
            color = "#00f";
        else
            color = "#000";

        text = text.concat(cell.no_soldiers);
        return <td><font color={color}>{text}</font></td>;
    }

    let rowToTable = (row) => {
        return <tr>{row}</tr>;
    }

    let cellToSprite = (cell) => {
        if (cell.hq == 1) {
            if (cell.faction == 1)
                return  <Sprite data = {{x:256, y:64, h:32, w:32}} 
                image = '/sprites/grasslands_2.png' 
                position = {{x:cell.x*60, y:cell.y*60}} 
                number = {cell.no_soldiers}
                scale = {generalScale*1.2}
                />
            else if (cell.faction == 2)
                return  <Sprite data = {{x:224, y:64, h:32, w:32}} 
                image = '/sprites/grasslands_2.png' 
                position = {{x:cell.x*60, y:cell.y*60}} 
                number = {cell.no_soldiers}
                scale = {generalScale*1.2}
                />
        } else if (cell.tower == 1) {
            if (cell.faction == 1)
                return  <Sprite data = {{x:160, y:64, h:32, w:32}} 
                image = '/sprites/grasslands_2.png' 
                position = {{x:cell.x*60, y:cell.y*60}} 
                number = {cell.no_soldiers}
                scale = {generalScale*1.2}
                />
            else if (cell.faction == 2)
                return  <Sprite data = {{x:128, y:64, h:32, w:32}} 
                image = '/sprites/grasslands_2.png' 
                position = {{x:cell.x*60, y:cell.y*60}} 
                number = {cell.no_soldiers}
                scale = {generalScale*1.2}
                />
            else
                return  <Sprite data = {{x:194, y:64, h:32, w:32}} 
                image = '/sprites/grasslands_2.png' 
                position = {{x:cell.x*60, y:cell.y*60}} 
                number = {cell.no_soldiers}
                scale = {generalScale*1.2}
                />
        }

        if (cell.faction == 1)
            return  <Sprite data = {{x:0, y:0, h:32, w:32}} 
            image = '/sprites/m1.png' 
            position = {{x:cell.x*60, y:cell.y*60}} 
            number = {cell.no_soldiers}
            scale = {generalScale*1}
            />
        else if (cell.faction == 2)
            return  <Sprite data = {{x:0, y:0, h:32, w:32}} 
            image = '/sprites/m2.png' 
            position = {{x:cell.x*60, y:cell.y*60}} 
            number = {cell.no_soldiers}
            scale = {generalScale*1}
            />
        else
            return null;

    }

    let cellToBackground = (cell) => {
        return  <Sprite data = {{x:0, y:64, h:32, w:32}} 
        image = '/sprites/grasslands_2.png' 
        position = {{x:cell.x*60, y:cell.y*60}}
        scale = {generalScale*2} 
        />
    }

    let handleOnClick = async () => {
        var res = await playGame();
        setGameStates(res.states);
        setWinner(res.winner);

        console.log(res.states);
        var final = {};
        for (let k = 0; k < res.states.length; ++k) {
            let board = res.states[k];
            final[k] = [];
            let grid = [];
            for (let i = 0; i < board.length; ++i) {
                //final[k][i] = board[i].map(cell => cellToTable(cell));
                grid = grid.concat(board[i].map(cell => cellToBackground(cell)));
                grid = grid.concat(board[i].map(cell => cellToSprite(cell)));
            }
            final[k] = grid;
        }
        //setBoards(final);
        setTileMap(final);

        setSimulationStarted(prev => !prev);

        setStateIdx(0);
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }


    const requestRef = useRef();
    const previousTimeRef = useRef();
  
    const animate = time => {
        if (previousTimeRef.current != undefined) {
          const deltaTime = time - previousTimeRef.current;
          
          setStateIdx(prevIdx => (prevIdx + deltaTime * 0.001) % 20);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
      }
  

    return(
        <section id = "Arena">
            <div className = "wrapper">
                <h2> Arena </h2>
                {!fightStarted ? <div className = "form-wrapper">
                    <form className = "form" onSubmit={handleSubmit}>
                        <label>
                        <p>Player 1</p>
                        <input type="text" onChange = {e => setPlayer1(e.target.value)}/>
                        </label>
                        <label>
                        <p>Player 2</p>
                        <input type="text" onChange = {e => setPlayer2(e.target.value)}/>
                        </label>
                        <div>
                        <button type="submit">Fight</button>
                        </div>
                    </form>
                </div> : 
                    <div className="game-wrapper">
                        {!simulationStarted ? <button onClick = {handleOnClick}> Start Simulation </button> :
                                                        //(boards ? <table><tbody>{boards[Math.floor(stateIdx)]}</tbody></table> : <p> Loading... </p>)
                                                        tileMap ? tileMap[Math.floor(stateIdx)] : <p> Loading.. </p>
                                                        }
                    </div>
                }
            </div>
        </section>
    );
}