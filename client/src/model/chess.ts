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

    /**
     * Apply movement if legal and return a boolean 
     * to indicate it and one to indicate 
     * if a piece was eat during movement
     * @param type the piece
     * @param px previous x position
     * @param py previous y position
     * @param tx next x position
     * @param ty next y position
     * @returns 
     */
    moveToIfLegal(type: string, px: number, py: number, tx: number, ty: number): [boolean, boolean] {
        const legalMove: boolean = 
            this.getPlayFor(type, px, py)
                .concat(this.getEatFor(type, px, py))
                .some(pos => pos.x === tx && pos.y === ty);

        if (legalMove)
            return [true, this.state.move(px, py, tx, ty)];
        return [false, false];
    }

    saveState(): void {
        
    }

    getInitialePosition(): Position[] {
        return this.state.convertBoardToPosition();
    }

    getPlayFor(type: string, x: number, y: number): Position[] {
        return this.state.getMoveFor(x, y, ...this.rules.getPlayFor(type));
    }

    getEatFor(type: string, x: number, y: number): Position[] {
        return this.state.getEatFor(type, x, y, ...this.rules.getEatFor(type));
    }

    getStarter(): number {
        return this.currentPlayer;
    }

}