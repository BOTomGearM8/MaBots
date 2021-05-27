// Class that holds information about each action of a player
class Action {
    constructor(x1, y1, x2, y2, type) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = type;   // 'm' for move OR 'c' for create OR 'f' for forfeit
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
    static HQ_TAKEN = 6613;

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
                        this.faction = 0;
                        return 1;
                    } else {
                        this.faction = 0;
                        return 2;
                    }
                } else {
                    this.faction = 0;
                }
            }
        }

        return 0;
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
                    
                    return GridCell.HQ_TAKEN;
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

                        return 1;

                    } else {
                        // Update no of towers for player
                        
                        return 2;

                    }

                // Else kill one enemy
                } else {
                    this.no_soldiers--;

                    if (this.no_soldiers == 0) {
                        if (this.faction == 1) {
                            return -1;
                        } else if (this.faction == 2) {
                            return -2;
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
        var text = type + (this.no_soldiers > 9 ? " " : "  ") + this.no_soldiers + " ";

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

    // Get faction
    getFaction() {
        return this.faction;
    }

     // Get number of soldiers
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

module.exports.Action = Action;
module.exports.RoundActions = RoundActions;
module.exports.PrintWithColors = PrintWithColors;
module.exports.GridCell = GridCell;