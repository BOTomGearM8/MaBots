const skel = require("./skel");

var board_size = 5;
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
    getMyTowers(board) {
        this.towers = [];
        for (let i = 0; i < board_size; i++) {
            for (let j = 0; j < board_size; j++) {
                if (board[i][j].faction == this.faction) {
                    if(board[i][j].tower == 1 || board[i][j].hq == 1) {
                        // i want to know how to push them either i j / j i
                        this.towers.push([j, i]);
                    }
                }
            }
        }
    }
    getOccupiedGrids(board) {
        var nr = [];
        for(let i = 0; i < board_size; i++ ) {
            for(let j = 0; j < board_size; j++) {
                if(board[i][j].faction == this.faction) {
                    nr.push([j, i]);
                }
            }
        }
        return nr;
    }
    getNearestTowerAny(board, mine) {
        var costs = [];
        // compute [xorig yorig xmutare ymutare cost] towards nearest tower from every point
       var occupied_grids = this.getOccupiedGrids(board);
       let min = 5000;
       let b = 0;
        for(let i = 0; i < occupied_grids.length; i++) {
            var arr = [];
            arr.push(occupied_grids[i][0]);
            arr.push(occupied_grids[i][1]);
            var nearest = this.getNearestTower(board, occupied_grids[i][0], occupied_grids[i][1], mine);
            arr.push(nearest[0]);
            arr.push(nearest[1]);
            arr.push(nearest[2]);
            costs.push(arr);
            if(nearest[2] < min) {
                min = nearest[2];
                b = i;
            }
        }
        // return the minimum
        return costs[b];

    }
    // nearest tower when the point is given
    // returns [x y cost]
    getNearestTower(board, x, y, mine) {
        var towers_to_check = [];
        var result = [];
        if(mine == 0) {
            // get all towers on the board that are not mine
            for (let i = 0; i < board_size; i++) {
                for (let j = 0; j < board_size; j++ ) {
                    if (board[i][j].tower == 1 && board[i][j].faction != this.faction) {
                        if(j == x && i == y)
                            continue;
                        towers_to_check.push([j, i]);
                    }
                }
            }
        } else {
            //  i check just in my towers
            // is this how this works?
            for (let m = 0; m < this.towers.length; m++) {
                if(this.towers[m][0] == x && this.towers[m][1] == y)
                    continue;
                towers_to_check.push(this.towers[m]);
            }

        }
        var min = 25;
        var new_x = 0;
        var new_y = 0;
        for (let i = 0; i < towers_to_check.length; i++) {
            let x1 = towers_to_check[i][0];
            let y1 = towers_to_check[i][1];
            let sum = Math.min(Math.abs(x - x1) + Math.abs(y -  y1));
            if (sum < min) {
                min = sum;
                if (x1 == x) {  //ox axis
                    if(y == y1 ) {
                        new_y = y;
                    }
                    if (y < y1 ) {
                        new_y = y + 1;
                    } else {
                        new_y = y - 1;
                    }
                    new_x = x;
                } else if (y1 == y) { // on oy axis
                    if (x < x1 ) {
                        new_x = x + 1;
                    } else {
                        new_x = x - 1;
                    }
                    new_y = y;
                // // i check the 4 quadrants -> I am not sure here
                } else if ( x < x1 && y < y1) {
                    new_x = x + 1;
                    new_y = y + 1;
                }  else if ( x < x1 && y > y1) {
                    new_x = x + 1;
                    new_y = y - 1;
                }  else if ( x > x1 && y < y1) {
                    new_x = x - 1;
                    new_y = y + 1;
                } else if ( x > x1 && y > y1) {
                    new_x = x - 1;
                    new_y = y - 1;
                }
            }
        }
        result.push(new_x);
        result.push(new_y);
        result.push(min);
        return result;
    }
    getScoreGridConq([x, y], board) { 
        var maxi = 0;
        var max = 1000;
        var new_x = 0;
        var new_y = 0;
        var result = [];

        if (board[y][x].no_soldiers <= 1) {
            result.push(2000);
            result.push(x);
            result.push(y);
            result.push(new_x);
            result.push(new_y);
            return result;
        }

        let dx = [0, 1, 1, 1, 0, -1, -1, -1];
        let dy = [1, 1, 0, -1, -1, -1, 0, 1];
        
        for (let d = 0; d < 8; ++d) {
            let m_y = y + dy[d];
            let m_x = x + dx[d];
            
            if (m_y >= 0 && m_y < board_size &&
                m_x >= 0 && m_x < board_size) {
                if (board[m_y][m_x].tower == 1) {
                    if(board[m_y][m_x].faction != this.faction) {
                        maxi = board[m_y][m_x].no_soldiers - board[y][x].no_soldiers;
                        if(max > maxi) {
                            max = maxi;
                            new_x = m_x;
                            new_y = m_y; 
                        }
                    }
                }
            }
        }
        result.push(max);
        result.push(x);
        result.push(y);
        result.push(new_x);
        result.push(new_y);
        return result;
    }

    getBestAction(board) {
        // ocuupied by me
        var occupied_grids = this.getOccupiedGrids(board);
        var scores_c = [];

        // // // i get the 'scores' for every cell grid i have trupes on
        let min = 3000, iMin = 0;
        for(let i = 0; i < occupied_grids.length; i++) {
            scores_c.push(this.getScoreGridConq(occupied_grids[i], board));
     //       process.stdout.write("The scores " + scores_c[i][0] + " " + scores_c[i][1] + " " + scores_c[i][2] + 
      //                          scores_c[i][3] + scores_c[i][4] +  "\n");
            if (scores_c[i][0] < min) {
                min = scores_c[i][0];
                iMin = i;
            }
        }
        console.log(scores_c);
        // // minimum from the score array
        //var index_max_score_c = scores_c.reduce((iMin, x, i, scores_c) => x < scores_c[iMin][0] ? i : iMin, 0);
        var index_max_score_c = iMin;
        console.log(scores_c[index_max_score_c]);
        // i can conquer something -> i do it
        if(scores_c[index_max_score_c][0] <= 0) {
            return new skel.Action(scores_c[index_max_score_c][2], scores_c[index_max_score_c][1],
                                scores_c[index_max_score_c][4], scores_c[index_max_score_c][3], 'm');
        }
        // there is something near me -> i try to send trupes from the nearest tower
        if(scores_c[index_max_score_c][0] < 1000) {
            let nearest_tower = this.getNearestTower(board, scores_c[index_max_score_c][1], scores_c[index_max_score_c][2], 1);
            // i do not have enough trupes -> i need to create

            if(scores_c[index_max_score_c][0] >= 
                    board[nearest_tower[0]][nearest_tower[1]].no_soldiers) {
                return new skel.Action(nearest_tower[1], nearest_tower[0], 0, 0, 'c');
            }
            // process.stdout.write("I do not have trupes, but i send what i have" +  nearest_tower[0] + nearest_tower[1] + "\n");
          //  process.stdout.write("Need help ?\n" + scores_c[index_max_score_c][1] + scores_c[index_max_score_c][2] +  nearest_tower[0] + nearest_tower[1]  +"\n");
            return new skel.Action(scores_c[index_max_score_c][2], scores_c[index_max_score_c][1],scores_c[index_max_score_c][4], scores_c[index_max_score_c][3], 'm');
        }
        // there is nothing near me -> i move towards nearest tower

         if(scores_c[index_max_score_c][0] == 2000) {
            let nearest_tower = this.getNearestTowerAny(board, 1);
            return new skel.Action(nearest_tower[1], nearest_tower[0], nearest_tower[3], nearest_tower[2], 'c');
        }
        // de ce nu face asta??
        let nearest_tower = this.getNearestTowerAny(board, 0);
        return new skel.Action(nearest_tower[1], nearest_tower[0], nearest_tower[3], nearest_tower[2], 'm');
    }

    // i really hope this is fine
    // update the copy of the board after the first action
    update_board(copy_board, action) {
        if (action.type == 'c') {
            copy_board[action.y1][action.x1].no_soldiers++;
        
        // If move action
        } else {
            copy_board[action.y1][action.x1].no_soldiers--;
            if(copy_board[action.y2][action.x2].faction != this.faction ) {
                // empty tile 
                if(copy_board[action.y2][action.x2].soldiers == 0) {
                    copy_board[action.y2][action.x2].no_soldiers++;
                    copy_board[action.y2][action.x2].faction = this.faction;
                } else {
                    copy_board[action.y2][action.x2].no_soldiers--;
                }
            } else {
                copy_board[action.y2][action.x2].no_soldiers++;
            }
        }
    }

    // this seems fine
    make_copy_board(board) {
        var copy_board = [];
        for (let i = 0; i < board_size; i++) {
            copy_board[i] = [];
            for (let j = 0; j < board_size; j++) {
                copy_board[i][j] = new skel.GridCell( 
                        i, 
                        j, 
                        board[i][j].faction,
                        board[i][j].no_soldiers,
                        board[i][j].tower,
                        board[i][j].hq
                    );
            }
        }  
        return copy_board;
    }

    getPlayerActions() {
        var copy_board = this.make_copy_board(this.board);
        this.getMyTowers(copy_board);
        var action1 = this.getBestAction(copy_board);
        this.update_board(copy_board, action1);
        this.getMyTowers(copy_board);
        var action2 = this.getBestAction(copy_board);
        var round_action = new skel.RoundActions(action1, action2);
        process.stdout.write("Action 1: " + action1.type + action1.y1 + action1.x1 + action1.y2 + action1.x2 + "\n");
        process.stdout.write("Action 2: " + action2.type + action2.y1 + action2.x1 + action2.y2 + action2.x2 + "\n");
        return round_action;
    }
}

module.exports.MaBot = MaBot;