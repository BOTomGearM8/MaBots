const ps = require("prompt-sync");      // Used for stdin input 
const skel = require("./skel");         // The required classes
const bot1 = require("./bot1");         // Bot of player 1
const bot2 = require("./bot2");         // Bot of player 2

const prompt = ps();    // Used for user input

// TO DO: define game variables inside engine() and send them as parameters(?)
var board = [];         // Game board
var gameStates = []     // Game states history
var round = 0;          // Current round
var gameOver = 0;       // Game over condition
var boardSize = 5;      // Size of game board
var no_sold_start = 2;  // Number of soldiers in HQ at the start
var round_to_tie = 20;  // Number of rounds until game ends in tie
var noTowersPlayer1,    // Number of towers for player1 
    noTowersPlayer2;    // Number of towers for player2


// Creates the same board each time
function createStandardBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = new skel.GridCell(i, j, 0, 0, 0, 0);
        }
    }

    board[0][0].makeHQ(no_sold_start, 1);
    board[4][4].makeHQ(no_sold_start, 2);
    
    board[4][0].makeTower(2);
    board[0][4].makeTower(2);

    board[1][2].makeTower(3);
    board[3][2].makeTower(3);
    
    noTowersPlayer1 = 1;
    noTowersPlayer2 = 1;
}

// Prints game board
function printBoard(boardState) {
    for (let i = 0; i < boardSize; i++) {
        process.stdout.write("-".repeat(10 * boardSize) + "-\n");
        for (let j = 0; j < boardSize; j++) {
            process.stdout.write("| ");
            process.stdout.write(boardState[i][j].printCell());
        }
        process.stdout.write("|\n");
    }
    process.stdout.write("-".repeat(10 * boardSize) + "-\n\n");
}

// Create random symetrical board
function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = new skel.GridCell(i, j, 0, 0, 0, 0);
        }
    }

    board[0][0].makeHQ(no_sold_start, 1);                           // RED HQ
    board[boardSize - 1][boardSize - 1].makeHQ(no_sold_start, 2);   // BLUE HQ
    
    var towerX, towerY;

    for (let i = 0; i < Math.floor(boardSize / 2); ++i) {
        do {
            towerX = Math.floor(Math.random() * (boardSize - 1));
            towerY = Math.floor(Math.random() * (boardSize - 1));
        } while (board[towerX][towerY].isTower() ||
                board[boardSize - towerX - 1][boardSize - towerY - 1].isTower() ||
                (towerX === boardSize - towerX - 1 && 
                 towerY === boardSize - towerY - 1) ||
                board[towerX][towerY].isHQ() ||
                board[boardSize - towerX - 1][boardSize - towerY - 1].isHQ());

        // create symmetrical towers
        var rand = Math.floor(Math.random() * 2);

        board[towerX][towerY].makeTower(Math.ceil(boardSize / 2) - i + rand);
        board[boardSize - towerX - 1][boardSize - towerY - 1]
            .makeTower(Math.ceil(boardSize / 2) - i + rand);
    }

    // HQs are towers; each player starts with one
    noTowersPlayer1 = 1;
    noTowersPlayer2 = 1;
}

// Read action from input
function getActionFromInput() {
    var actType;
    var x1, y1, x2, y2;

    actType = prompt("Enter type: ");

    if (actType == 'f') {
        return -1;
    }

    x1 = prompt("X1: ");
    y1 = prompt("Y1: ");

    if (actType == 'm') {
        x2 = prompt("X2: ");
        y2 = prompt("Y2: ");
    } else {
        x2 = y2 = 0;
    }

    return new skel.Action(x1, y1, x2, y2, actType);
}

// Get player actions for this turn
function getPlayerActions() {
    console.log("Actions:\n\t'm' for moving soldier\n\t'c' for creating soldier\n");
    
    // Get first action
    console.log("Action 1: ");
    var action1 = getActionFromInput();

    if (action1 == -1) {
        return -1;
    }

    // Get second action
    console.log("Action 2: ");
    var action2 = getActionFromInput();

    if (action2 == -1) {
        return -1;
    }

    return new skel.RoundActions(action1, action2);
}

// Check if coordinates inside game board
function onBoard(x, y) {
    if (x < 0 || x >= boardSize ||
        y < 0 || y >= boardSize) {

        return 0;
    }

    return 1;
}

// Check if two coordinates are neighbours
function checkNeighbour(x1, y1, x2, y2) {
    if (Math.abs(x2 - x1) > 1 ||
        Math.abs(y2 - y1) > 1 ) {

        return 0;
    }

    return 1;
}

// Check if a action is valid
function checkValidAction(action, curPlayer) {
    // Check valid create action
    if(action.type == 'c') {
        // Check if on board
        if (onBoard(action.x1, action.y1) == 0) {
            console.log("Cell not on game board");

            return 0;
        }

        // Check if cell can get reinforcements
        if(board[action.x1][action.y1].validTower(curPlayer) == 0) {
            console.log("You can't create a soldier there");
    
            return 0;
        }

    // Check valid move action 
    } else {
        // Check if on board
        if (onBoard(action.x1, action.y1) == 0) {
            console.log("ERROR: Start cell not on game board");

            return 0;
        }

        // Check if on board
        if (onBoard(action.x2, action.y2) == 0) {
            console.log("ERROR: Destination cell not on game board");

            return 0;
        }

        // Check if 2 cells are neigbours
        if (checkNeighbour(action.x1, action.y1, action.x2, action.y2) == 0) {
            console.log("ERROR: Can't reach destination cell from start cell");

            return 0;
        }

        // Check if you can move a soldier form start cell
        if (board[action.x1][action.y1].validStartCell(curPlayer) == 0) {
            console.log("ERROR: You don't control the start cell or no soldiers are there");

            return 0;
        }
    }

    return 1;
}

// Check if game over because of number of towers
function checkTowersNo() {
    if (noTowersPlayer1 - noTowersPlayer2 > 1) {
        gameOver = 1;
    } else if (noTowersPlayer2 - noTowersPlayer1 > 1) {
        gameOver = 2;
    }
}

// Process the players action
function processAction(action, curPlayer) {
    // Check if action is valid
    if(checkValidAction(action, curPlayer) == 0) {
        return;
    }

    var ret_val;

    // If create action
    if (action.type == 'c') {
        board[action.x1][action.y1].createSoldier();
    
    // If move action
    } else {
        // Take soldier from starting cell
        ret_val = board[action.x1][action.y1].removeOneSoldier();
        
        // Check if any tower was left empty
        if (ret_val == 1) {
            noTowersPlayer1--;
        } else if (ret_val == 2) {
            noTowersPlayer2--;
        }
        
        // Add soldier to destination cell
        ret_val = board[action.x2][action.y2].addFactionSoldier(curPlayer);
        
        // Check if HQ or tower captured
        if (ret_val == skel.GridCell.HQ_TAKEN) {
            gameOver = curPlayer;
        } else if (ret_val == 1) {
            noTowersPlayer1++;
        } else if (ret_val == 2) {
            noTowersPlayer2++;
        } else if (ret_val == -1) {
            noTowersPlayer1--;
        } else if (ret_val == -2) {
            noTowersPlayer2--;
        }

        // Check if game ends becuase of tower difference
        checkTowersNo();
    }
}

// Process players action in a turn
function processTurn(playerActions, curPlayer) {
    var action1 = playerActions.getAction1();
    var action2 = playerActions.getAction2();
    
    processAction(action1, curPlayer);
    processAction(action2, curPlayer);
}

// Print history of board states
function printGameStates() {
    for (let i = 0; i < round; i++) {
        printBoard(gameStates[i]);
    }
}

// Add game state to history array
function addGameState() {
    gameStates[round] = []
    for (let i = 0; i < boardSize; i++) {
        gameStates[round][i] = []
        for (let j = 0; j < boardSize; j++) {
            gameStates[round][i][j] = new skel.GridCell( 
                    i, 
                    j, 
                    board[i][j].getFaction(),
                    board[i][j].getNoSoldiers(),
                    board[i][j].isTower(),
                    board[i][j].isHQ()
                );
        }
    }
}

/** 
 * Main function of the game
 *
 * @returns json containing the winner of the game
 *          and the history of the match
 */
function engine() {
    var curPlayer = 2;

    // Create board
    // createStandardBoard();
    createBoard();

    // Bots of players
    var player1 = new bot1.MaBot(1, 0, 0, no_sold_start, board);
    var player2 = new bot2.MaBot(2, 4, 4, no_sold_start, board);

    var playerActions;
    
    while (gameOver == 0 && round < round_to_tie) {
        // Switch player
        curPlayer ^= 1 ^ 2;
        
        // Add game state to history
        addGameState();

        // Increment round
        round++;

        process.stdout.write("\nPlayer to move: ");

        if (curPlayer == 1) {
            console.log(skel.PrintWithColors.printRed("Red"));
        } else {
            console.log(skel.PrintWithColors.printBlue("Blue"));
        }

        printBoard(board);

        // Get actions form player
        // playerActions = getPlayerActions();

        // Check which player needs to move
        if (curPlayer == 1) {
            playerActions = player1.getPlayerActions();
        } else {
            playerActions = player2.getPlayerActions();
        }

        // Check forfeit
        if (playerActions == -1) {
            curPlayer ^= 1 ^ 2;
            gameOver = curPlayer;
            break;
        }

        // Process actions
        processTurn(playerActions, curPlayer);
    }

    /* Game over */
    
    // Check if TIE
    if (round == round_to_tie) {
        process.stdout.write("\nGAME OVER IN ROUND: " + round + " ! " + skel.PrintWithColors.printGreen("TIE") + "\n");

        printBoard(board);

        // Send gameStates to frontend
        return {
            winner: 0,
            states: gameStates
        }

    // Print victory message
    } else {
        process.stdout.write("\nGAME OVER IN ROUND: " + round + " ! PLAYER ");
        if (gameOver == 1) {
            process.stdout.write(skel.PrintWithColors.printRed("RED"));
        } else {
            process.stdout.write(skel.PrintWithColors.printBlue("BLUE"));
        }
        process.stdout.write(" WON!\n");
    }
    printBoard(board);

    // Send gameStates to frontend
    return {
        winner: gameOver,
        states: gameStates
    }
}

// TO DO: should wait for request from frontend to start(?)

// Uncomment for testing
// engine();

exports.engine = engine;