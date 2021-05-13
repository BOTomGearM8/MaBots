import './Arena.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
    var x = 0;

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

    let handleOnClick = async () => {
        var res = await playGame();
        setGameStates(res.states);
        setWinner(res.winner);
        setSimulationStarted(true);

        console.log(res.states);
        var final = {};
        for (let k = 0; k < res.states.length; ++k) {
            let board = res.states[k];
            final[k] = [];
            for (let i = 0; i < board.length; ++i) {
                final[k][i] = board[i].map(cell => cellToTable(cell));
                console.log(final[k][i]);
            }
            final[k] = final[k].map(row => rowToTable(row));
        }
        console.log(final);
        setBoards(final);
    }

    // let update = () => {
    //     setStateIdx(stateIdx + 1);
    //     window.requestAnimationFrame(update);
    // }

    const requestRef = useRef();
    const previousTimeRef = useRef();
  
    const animate = async time => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            
            // Pass on a function to the setter of the state
            // to make sure we always have the latest state
            //if (simulationStarted) {
                //await setStateIdx(stateIdx + 1);
            //}
            if (simulationStarted) {
                console.log(x);
                //setStateIdx(stateIdx + 1);
                x += 1;
            } else {
                setStateIdx(0);
                x = 0;
            }
        }
        previousTimeRef.current = time;
        requestRef.current = await requestAnimationFrame(animate);
    }
  
    useEffect(() => {
        x = 0;
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

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
                                                        (boards ? <table><tbody>{boards[x < 20 ? x : 0]}</tbody></table> : <p> Loading... </p>)}
                    </div>
                }
            </div>
        </section>
    );
}