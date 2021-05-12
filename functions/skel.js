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

module.exports.Action = Action;
module.exports.RoundActions = RoundActions;
