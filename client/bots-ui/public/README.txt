Welcome to the Documentation section!

First we will start by explaining this season's game: Go Tower Or Go HQ

The game is represented by a 5x5 board with multiple types of cells.
These cells can be:
    - HQ:       The base of the player. Can spawn soldiers. When captured the game is lost.
    - Tower:    A fortification on the map than when captured also the controling player to spawn soldiers inside of it, 
                giving him the advantage of having new soldiers closer to the battlefield. 
                Initialy the towers will be controled by NPCs, which the players need to kill before capturing the fortification.
    - Empty:    No special perk. Can hold soldiers.
Each of the cell can hold any number of soldiers.

The goal of the game is to either take the enemys HQ or to have 2 towers more than your opponent.
In order for you to do this you need to strategically move and create soldiers so that you can
capture the towers onthe map or the base of your enemy.

The game is turn based, meaning players make moves in turns.
On each turn, the player is allowed to make 2 actions.
The possible actions are:
    - Creating a soldier in your HQ or any tower that you control
    - Move one soldier in any adjacent cell (N, NE, E, SE, S, SV, V, NV)

    Tower capturing:
In order for a player to capture a tower, they need to put one soldier inside. This is only possibile when the tower is empty. 
Meaning that if the tower is defended by enemy or NPC soldiers, you first need to kill them.

    HQ capturing:
HQ capturing and tower capturing work in the same manner. The diffrence is made by the fact that when a HQ is taken,
the game is immediately won by the player who captured it. 

    Soldier movement:
When a soldier is moved to a cell, one of the following things can happen:
    - Reinforce the position:   If the cell is already under your control, than add one more soldier to it.
    - Capture a position:       If the cell is has no soldeirs inside it, than capture it
    - Attack a position:        If the cell is defended by enemy or NPC soldiers, than the soldiers sacrifices himself to kill one enemy.

OBS: If the last soldier in a tower moves out of it, than you lose control over that tower!

-----------------------------------

In this part we will elaborate on how you can start creating and fighting with you own bots inside of the arena.

At the moment we only support JavaScript, but we are working on adding support for multiple other programing languages.

In order to make the development as easy as posibile, we created a "skeleton" for you to start with.
This skeleton, if used as we advise, ensures that your bot will be able to run on our systems.
It contains 2 files:
    1. skel.js
    2. MaBot.js

1. skel.js
    This files contains classes that you need to use in development:
        - Action:           Defines one of the 2 actions inside a turn
        - RoundActions:     Defines the 2 actions that a payer makes in a round.
                            This also the format that you need to give your actions to the engine for processing.
        - PrintWithColors:  Used to print data acording to player fortification
        - GridCell:         Holds all the information of a board cell

2. MaBot.js
    This is the place where your bot will come to live. You only need to modify this Class.
    The class MaBot contains a constructor which you should not change and a function called getPlayerActions().
    getPlayerActions() is the function that the engine uses to get a RoundActions object.
    In other words, this is the place where you need to add all the logic of your bot.
    Feel free to create as many other functions and classes as you need,
    but MAKE SURE that you DO NOT CHANGE the constructor and the name of the function.

Please read the 2 files for more details.

Good luck in the arena, and may the best bot win!
