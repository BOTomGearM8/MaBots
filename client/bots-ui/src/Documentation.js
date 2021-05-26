import './Documentation.css'

export default function Documentation() {
    return(
        <section id = "Documentation">
            <div className = "wrapper">
                <h2>Welcome to the Documentation section!</h2>
                <br/>

                <div className="doc-tile" id="the-game">
                    <h3>The Game</h3>
                    <p>The game is represented by a 5x5 board with multiple types of cells.</p>
                    <p>This cells can be:</p>
                    <ul>
                        <li><strong>HQ</strong>: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;The base of the player. Can spawn soldiers. When captured the game is lost.</li>
                        <li><strong>Tower:</strong> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;A fortification on the map than when captured also the controling player to spawn soldiers inside of it, giving him the advantage of having new soldiers closer to the battlefield.<br/>Initialy the towers will be controled by NPCs, which the players need to kill before capturing the fortification.</li>
                        <li><strong>Empty</strong>: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;No special perk. Can hold soldiers.</li>
                    </ul>
                    <p>Each of the cell can hold any number of soldiers.</p>
                    <p>The game is turn based, meaning players make moves in turns.</p>
                    <p>On each turn, the player is allowed to make 2 actions.</p>
                    <p>The possible actions are:</p>
                    <ul>
                        <li>Creating a soldier in your HQ or any tower that you control</li>
                        <li>Move one soldier in any adjacent cell (N, NE, E, SE, S, SV, V, NV)</li>
                    </ul>
                    <p>&nbsp;</p>
                    {/* <p>&nbsp;</p> */}
                </div>

                {/* <p>&nbsp;</p> */}
                <div className="doc-tile" id="the-goal">
                    <h3>The Goal</h3>
                    <p><i>Go Tower Or Go HQ</i></p>
                    <p>The goal of the game is to either take the enemys HQ or to have 2 towers more than your opponet.</p>
                    <p>In order for you to do this you need to strategically move and create soldiers so that you can</p>
                    <p>capture the towers onthe map or the base of your enemy.</p>
                    <p>&nbsp; &nbsp; Tower capturing:</p>
                    <p>In order for a player to capture a tower, they need to put one soldier inside. This is only possibile when the tower is empty. Meaning that if the tower is defended by enemy or NPC soldiers,<br/>you first need to kill them.</p>
                    <p>&nbsp;</p>
                    <p>&nbsp; &nbsp; HQ capturing:</p>
                    <p>HQ capturing and tower capturing work in the same manner. The diffrence is made by the fact that when a HQ is taken, the game is immediately won by the player who captured it.</p>
                    <p>&nbsp;</p>
                    <p>&nbsp; &nbsp; Soldier movement:</p>
                    <p>When a soldier is moved to a cell, one of the following things can happen:</p>
                    <ul>
                        <li>Reinforce the position: &nbsp;&nbsp;If the cell is already under your control, than add one more soldier to it.</li>
                        <li>Capture a position: &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;If the cell is has no soldeirs inside it, than capture it</li>
                        <li>Attack a position: &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;If the cell is defended by enemy or NPC soldiers, than the soldiers sacrifices himself to kill one enemy.</li>
                    </ul>
                    <p>&nbsp;</p>
                    <p><em>OBS: If the last soldier in a tower moves out of it, than you lose control over that tower!</em></p>
                </div>
                {/* <p>&nbsp;</p> */}
                <div className="doc-tile" id="the-doc">
                    <h3>The Doc</h3>
                    <p>In this part we will elaborate on how you can start creating and fighting with you own bots inside of the arena.</p>
                    <p>At the moment we only support JavaScript, but we are working on adding support for multiple other programing languages.</p>
                    <p>In order to make the development as easy as posibile, we created a &quot;skeleton&quot; for you to start with. This skeleton, if used as we advise, ensures that your bot will be able to run on our systems.</p>
                    <p>It contains 2 files:</p>
                    <ol>
                        <li>skel.js</li>
                        <li>MaBot.js</li>
                    </ol>
                    <br/>
                    <p>1. skel.js</p>
                    <p>This files contains classes that you need to use in development:</p>
                    <ul>
                        <li>Action: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Defines one of the 2 actions inside a turn</li>
                        <li>RoundActions: &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Defines the 2 actions that a payer makes in a round. This also the format that you need to give your actions to the engine for processing.</li>
                        <li>PrintWithColors: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Used to print data acording to player fortification</li>
                        <li>GridCell: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Holds all the information of a board cell</li>
                    </ul>
                    <p>&nbsp;</p>
                    <p>2. MaBot.js</p>
                    <p>This is the place where your bot will come to live. You only need to modify this Class.</p>
                    <p>The class MaBot contains a constructor which you should not change and a function called getPlayerActions(). &nbsp;getPlayerActions() is the function that the engine uses to get a RoundActions object.<br/>In other words, this is the place where you need to add all the logic of your bot. Feel free to create as many other functions and classes as you need,<br/>but MAKE SURE that you DO NOT CHANGE the constructor and the name of the function.</p>
                    <p></p>
                    <p>Please read the 2 files for more details.</p>
                    <p></p>
                    <p>Good luck in the arena, and may the best bot win!</p>
                    <p><br/></p>
                </div>
            </div>
        </section>
    );
}