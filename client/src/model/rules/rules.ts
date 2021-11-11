import { Direction } from "../directions";

export const MOVEMENT = "MOVEMENT"; 

type Action = (...args: any[]) => any;

export abstract class Rules {

    private static EAT: string = "e";
    private static MOVE: string = "m";

    private keyFct: Map<string, Action> = new Map();

    constructor() {
        const moves: Array<[string[], Action]> = [
            [["k", "K"], this.mvtOfKing],
            [["q", "Q"], this.mvtOfQueen],
            [["r", "R"], this.mvtOfRook],
            [["n", "N"], this.mvtOfKnight],
            [["b", "B"], this.mvtOfBishop],
            [["p", "P"], this.mvtOfPawn]
         ];
        moves.forEach(([pieces, action]) => {
            pieces.forEach(piece => this.keyFct.set(Rules.MOVE + piece, action));
        })

        const eats: Array<[string[], Action]> = [
            [["k", "K"], this.eatOfKing],
            [["q", "Q"], this.eatOfQueen],
            [["r", "R"], this.eatOfRook],
            [["n", "N"], this.eatOfKnight],
            [["b", "B"], this.eatOfBishop],
            [["p", "P"], this.eatOfPawn]
         ];
         eats.forEach(([pieces, action]) => {
            pieces.forEach(piece => this.keyFct.set(Rules.EAT + piece, action));
        })
    }

    abstract defaultBoardFen(): string;

    private getActionFor(action: string, type: string): Action | undefined {
        return this.keyFct.get(action + type);
    }

    // Movements
    getPlayFor(type: string): [number, Direction[]] {
        return this.getActionFor(Rules.MOVE, type)?.call(this) ?? [];
    }

    abstract mvtOfKing(): [number, Direction[]];
    abstract mvtOfQueen(): [number, Direction[]];
    abstract mvtOfRook(): [number, Direction[]];
    abstract mvtOfBishop(): [number, Direction[]];
    abstract mvtOfKnight(): [number, Direction[]];
    abstract mvtOfPawn(): [number, Direction[]];

    // Eat
    getEatFor(type: string): [number, Direction[]] {
        return this.getActionFor(Rules.EAT, type)?.call(this) ?? [];
    }

    abstract eatOfKing(): [number, Direction[]];
    abstract eatOfQueen(): [number, Direction[]];
    abstract eatOfRook(): [number, Direction[]];
    abstract eatOfBishop(): [number, Direction[]];
    abstract eatOfKnight(): [number, Direction[]];
    abstract eatOfPawn(): [number, Direction[]];

    // // On Check

    // // On Movements
    // onKMvt(): Action,

    // // On Dead
    // onKDead(): Action
}

// enum ActionEvent {
//     KILL
// }

// abstract class Action {
//     type: ActionEvent;
//     how: Direction[];

//     constructor(type: ActionEvent, how: Direction[]) {
//         this.type = type;
//         this.how = how;
//     }
// }

// export class Explosion extends Action {
//     constructor() {
//         super(ActionEvent.KILL, [ROW, COL]);
//     }
// }
