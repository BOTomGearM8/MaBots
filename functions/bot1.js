const skel = require("./skel");

class MaBot {
    // DO NOT CHANGE
    constructor(faction, x, y, no_soldiers) {
        this.faction = faction;
        this.x = x;
        this.y = y;
        this.no_sold_start = no_soldiers;
    }

    // Add logic here
    getPlayerActions(enemysAction) {
        var action1 = new skel.Action(this.x, this.y, 0, 0, 'c');
        var action2;

        if (this.faction == 1) {
            action2 = new skel.Action(this.x, this.y, 1, 1, 'm');
        } else {
            action2 = new skel.Action(this.x, this.y, 3, 3, 'm');
        }

        return new skel.RoundActions(action1, action2);
    }
}

module.exports.MaBot = MaBot;