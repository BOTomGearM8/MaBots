const skel = require("./skel");

class MaBot {
    // DO NOT CHANGE
    constructor(faction, x, y, no_soldiers, board) {
        this.faction = faction;
        this.x = x;
        this.y = y;
        this.no_sold_start = no_soldiers;
        this.board = board;
    }

    // Add logic here
    getPlayerActions() {

    }
}

module.exports.MaBot = MaBot;