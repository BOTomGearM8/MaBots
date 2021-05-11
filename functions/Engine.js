const ps = require("prompt-sync");

const prompt = ps();    // Used for user input
var board = [];         // Game board
var gameStates = []     // Game states history
var round = 0;          // Current round
var gameOver = 0;       // Game over condition
var boardSize = 5;      // Size of game board
var noTowersPlayer1, noTowersPlayer2;

// Class that holds information about each action of a player
class Action {
    constructor(x1, y1, x2, y2, type) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = type;   // 'm' for move OR 'c' for create
    }
}

// Class that holds the 2 actions of a player in a round
class RoundActions {
    // Constructor for adding the 2 actions to the DTO
    constructor(action1, action2) {
        this.action1 = action1;
        this.action2 = action2;
    }

    getAction1() {
        return this.action1;
    }
    
    getAction2() {
        return this.action2;
    }
}

// Class for adding color to text
class PrintWithColors {
    constructor(){}

    // Red
    static printRed(text) {
        return "\x1b[91m" + text + "\x1b[39m";
    }

    // Blue
    static printBlue(text) {
        return "\x1b[94m" + text + "\x1b[39m";
    }

    // Green
    static printGreen(text) {
        return "\x1b[92m" + text + "\x1b[39m";
    }
}

// Class that contains details of a board cell
class GridCell {
    // Constructor for empty cells
    constructor(x, y, faction, no_soldiers, tower, hq)  {
        this.x = x;
        this.y = y;
        this.faction = faction;
        this.no_soldiers = no_soldiers;
        this.tower = tower;
        this.hq = hq;
    }

    // Initialize cell as a neutral tower with no_soldiers power
    makeTower(no_soldiers) {
        this.no_soldiers = no_soldiers;
        this.tower = 1;
    }

    // Initialize cell as a players HQ
    makeHQ(no_soldiers, faction) {
        this.no_soldiers = no_soldiers;
        this.tower = 1;
        this.faction = faction;
        this.hq = 1;
    }

    // Remove one soldier from the cell
    removeOneSoldier() {
        this.no_soldiers--;

        if (this.no_soldiers == 0) {
            if (this.hq == 0) {
                if (this.tower == 1) {
                    if (this.faction == 1) {
                        noTowersPlayer1--;
                    } else {
                        noTowersPlayer2--;
                    }
                }

                this.faction = 0;
            }
        }
    }

    // Add a soldier form a faction
    addFactionSoldier(faction) {
        // Cehck if HQ
        if (this.hq == 1) { 
            // If players HQ than reinforce
            if (this.faction == faction) {
                this.no_soldiers++;
            } else {
                // If HQ has no defense than capture it
                if (this.no_soldiers == 0) {
                    // GAME OVER, player 'faction' won
                    this.no_soldiers++;
                    this.faction = faction;
                    
                    gameOver = 1;
                    return faction;
                // If HQ has defense than kill one enemy
                } else {
                    this.no_soldiers--;
                }
            }

        // Check if tower
        } else if (this.tower == 1) {

            // If same faction than add reinforcements
            if (this.faction == faction) {
                this.no_soldiers++;
            
            } else {
                // If tower is empty capture it
                if (this.no_soldiers == 0) {
                    this.faction = faction;
                    this.no_soldiers = 1;

                    if (faction == 1) {
                        // Update no of towers for player
                        noTowersPlayer1++;

                        // Check if game over because of number of towers
                        if (noTowersPlayer1 - noTowersPlayer2 > 1) {
                            gameOver = 1;
                            return faction;
                        }
                    } else {
                        // Update no of towers for player
                        noTowersPlayer2++;

                        // Check if game over because of number of towers
                        if (noTowersPlayer2 - noTowersPlayer1 > 1) {
                            gameOver = 1;
                            return faction;
                        }
                    }

                // Else kill one enemy
                } else {
                    this.no_soldiers--;

                    if (this.no_soldiers == 0) {
                        if (this.faction == 1) {
                            noTowersPlayer1--;
                        } else if (this.faction == 2) {
                            noTowersPlayer2--;
                        }
                        this.faction = 0;
                    }
                }
            }
        
        // If clear cell
        } else {
            // If empty capture it
            if (this.no_soldiers == 0) {
                this.faction = faction;
                this.no_soldiers = 1;
            } else {
                // If players cell than reinforce
                if (this.faction == faction) {
                    this.no_soldiers++;
                // If opponents cell than kill one soldier
                } else {
                    this.no_soldiers--;

                    if (this.no_soldiers == 0) {
                        this.faction = 0;
                    }
                }
            }
        }

        return 0;
    }

    // Create soldier in cell
    createSoldier() {
        this.no_soldiers++;
    }

    // Create string for output
    createCellString(type) {
        var text = type + " " + this.no_soldiers + " ";

        if (this.faction == 1) {
            return PrintWithColors.printRed(text);
        } else if (this.faction == 2) {
            return PrintWithColors.printBlue(text);
        } else if (this.tower == 1) {
            return PrintWithColors.printGreen(text);
        } else {
            return text;
        }
    }

    // Print cell details
    printCell() {
        var cellString = "";

        if (this.hq == 1) {
            cellString = this.createCellString("HQ :");
        } else if (this.tower == 1) {
            cellString = this.createCellString(" T :");
        } else {
            cellString = this.createCellString("    ");
        }

        return cellString;
    }

    // Check if tower
    isTower() {
        return this.tower;
    }

    // Check if HQ
    isHQ() {
        return this.hq;
    }

    getFaction() {
        return this.faction;
    }

    getNoSoldiers() {
        return this.no_soldiers;
    }

    // Check if cell has tower than belong to certain player
    validTower(faction) {
        if (this.tower == 1 && this.faction == faction) {
            return 1;
        }
        return 0;
    }

    // Check if player has soldier to move in cell
    validStartCell(faction) {
        if (this.faction == faction && this.no_soldiers > 0) {
            return 1;
        }
        return 0;
    }
}

// Creates the same board each time
function createStandardBoard() {
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = new GridCell(i, j, 0, 0, 0, 0);
        }
    }

    board[0][0].makeHQ(2, 1);
    board[4][4].makeHQ(2, 2);
    
    board[4][0].makeTower(2);
    board[0][4].makeTower(2);

    board[1][2].makeTower(3);
    board[3][2].makeTower(3);
    
    noTowersPlayer1 = 1;
    noTowersPlayer2 = 1;
}

// Prints game board
function printBoard(boardState) {
    for (var i = 0; i < boardSize; i++) {
        process.stdout.write("-".repeat(9 * boardSize) + "-\n");
        for (var j = 0; j < boardSize; j++) {
            process.stdout.write("| ");
            process.stdout.write(boardState[i][j].printCell());
        }
        process.stdout.write("|\n");
    }
    process.stdout.write("-".repeat(9 * boardSize) + "-\n\n");
}

// Create random symetrical board
function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = new GridCell(i, j, 0, 0, 0, 0);
        }
    }

    board[0][0].makeHQ(2, 1);                           // RED HQ
    board[boardSize - 1][boardSize - 1].makeHQ(2, 2);   // BLUE HQ
    
    let towerX, towerY;

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

        // create symmetric towers
        let rand = Math.floor(Math.random() * 2);
        board[towerX][towerY].makeTower(Math.ceil(boardSize / 2) - i + rand);
        board[boardSize - towerX - 1][boardSize - towerY - 1]
            .makeTower(Math.ceil(boardSize / 2) - i + rand);
    }

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

    return new Action(x1, y1, x2, y2, actType);
}

// Get player actions for this turn
function getPlayerActions() {
    console.log("Actions:\n\t'm' for moving soldier\n\t'c' for creating soldier\n");
    
    console.log("Action 1: ");
    var action1 = getActionFromInput();

    if (action1 == -1) {
        return -1;
    }

    console.log("Action 2: ");
    var action2 = getActionFromInput();

    if (action2 == -1) {
        return -1;
    }

    return new RoundActions(action1, action2);
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

// Process the players action
function processAction(action, curPlayer) {
    // Check if action is valid
    if(checkValidAction(action, curPlayer) == 0) {
        return;
    }

    // If create action
    if (action.type == 'c') {
        board[action.x1][action.y1].createSoldier();
    
    // If move action
    } else {
        board[action.x1][action.y1].removeOneSoldier();
        board[action.x2][action.y2].addFactionSoldier(curPlayer);
    }
}

// Process players action in a turn
function processTurn(playerActions, curPlayer) {
    var action1 = playerActions.getAction1();
    var action2 = playerActions.getAction2();
    
    processAction(action1, curPlayer);
    processAction(action2, curPlayer);
}

function printGameStates() {
    for (var i = 0; i < round; i++) {
        printBoard(gameStates[i]);
    }
}

function addGameState() {
    gameStates[round] = []
    for (var i = 0; i < boardSize; i++) {
        gameStates[round][i] = []
        for (var j = 0; j < boardSize; j++) {
            gameStates[round][i][j] = new GridCell( 
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

// Main fucntion of the game
function engine() {
    var curPlayer = 2;

    // Create board
    //createStandardBoard();
    createBoard();

    while (gameOver == 0) {
        // Switch player
        curPlayer ^= 1 ^ 2;
        
        addGameState();

        // Increment round
        round++;

        process.stdout.write("\nPlayer to move: ");

        if (curPlayer == 1) {
            console.log(PrintWithColors.printRed("Red"));
        } else {
            console.log(PrintWithColors.printBlue("Blue"));
        }

        printBoard(board);

        // Get actions form player
        var playerActions = getPlayerActions();

        // Check forfeit
        if (playerActions == -1) {
            gameOver = 1;
            curPlayer ^= 1 ^ 2;
            break;
        }

        // Process actions
        processTurn(playerActions, curPlayer);
    }

    // Game over
    process.stdout.write("GAME OVER IN ROUND: " + round + " ! PLAYER ");
    if (curPlayer == 1) {
        process.stdout.write(PrintWithColors.printRed("RED"));
    } else {
        process.stdout.write(PrintWithColors.printBlue("BLUE"));
    }
    process.stdout.write(" WON!\n");

    printBoard(board);
}

engine();