import { Player } from "./player";
import { State } from "./state";
import { Position } from "./position";
import { Rules } from "./rules/rules";
import { ChessRules } from "./rules/chessRules";

export class Chess {

    private currentPlayer: Player;
    private state: State;
    private rules: Rules;

    constructor(fenState: string = "") {
        this.rules = new ChessRules();
        this.state = State.fromFen(fenState !== "" ? fenState : this.rules.defaultBoardFen());
        this.currentPlayer = Player.WHITE;
    }

    moveToIfLegal(type: string, px: number, py: number, tx: number, ty: number): boolean {
        console.log(type, px, py);
        
        const legal = this.getPlayFor(type, px, py).some(pos => {
            console.log(tx, ty, pos);
            
            return pos.x === tx && pos.y === ty
        });

        console.log(legal);
        
        if (legal)
            this.state.move(px, py, tx, ty);

        return legal;
    }

    saveState(): void {
        
    }

    getInitialePosition(): Position[] {
        return this.state.convertBoardToPosition();
    }

    getPlayFor(type: string, x: number, y: number): Position[] {
        return this.state.getMoveFor(x, y, ...this.rules.getPlayFor(type));
    }
}